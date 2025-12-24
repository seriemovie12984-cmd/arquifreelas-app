import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Obtener la URL correcta de producción
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (code) {
    const cookieStore = await cookies()
    
    // Crear respuesta que podemos modificar
    const response = NextResponse.redirect(new URL('/dashboard', siteUrl))
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                // Establecer en el cookieStore para el servidor
                cookieStore.set(name, value, options)
                // Establecer en la respuesta para el cliente
                response.cookies.set(name, value, options)
              })
            } catch (error) {
              console.error('Error setting cookies:', error)
            }
          },
        },
      }
    )
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Supabase exchange error:', error)
        return NextResponse.redirect(new URL('/login?error=exchange_failed', siteUrl))
      }

      if (data.session) {
        console.log('Session created successfully for user:', data.session.user.email)
        return response
      }
    } catch (err) {
      console.error('Supabase exchange exception:', err)
      return NextResponse.redirect(new URL('/login?error=exchange_exception', siteUrl))
    }
  }

  // Si no hay código, redirigir al login
  return NextResponse.redirect(new URL('/login', siteUrl))
}
