'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    // Evitar doble inicialización en StrictMode
    if (initialized.current) return
    initialized.current = true

    let unsubscribe: (() => void) | null = null

    const init = async () => {
      const supabase = await createClient()

      if (!supabase) {
        console.warn('Supabase client not available in this runtime')
        setLoading(false)
        return
      }

      // Obtener sesión inicial
      const getSession = async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) {
            console.error('Error getting session:', error)
          }
          setUser(session?.user ?? null)
        } catch (err) {
          console.error('Exception getting session:', err)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }

      await getSession()

      // Escuchar cambios de autenticación
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)

        // Crear o actualizar perfil cuando el usuario se autentica
        if (session?.user && _event === 'SIGNED_IN') {
          try {
            await supabase.from('profiles').upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
              avatar_url: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
              provider: session.user.app_metadata.provider,
            })
          } catch (err) {
            console.error('Profile upsert error:', err)
          }
        }
      })

      unsubscribe = () => subscription.unsubscribe()
    }

    init()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const supabase = await createClient()
    if (!supabase) throw new Error('Supabase client not available')

    // Usar la URL actual del navegador para el redirect
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    const redirectTo = `${currentOrigin}/auth/callback`

    console.log('Starting Google sign-in, redirectTo:', redirectTo)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          prompt: 'select_account',
        },
      },
    })

    if (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = await createClient()
    if (!supabase) {
      setUser(null)
      return
    }
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (err) {
      console.error('Sign out error:', err)
      setUser(null)
    }
  }, [])

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }
}
