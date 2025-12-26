import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  
  // Obtener la URL correcta de producción
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arquifreelas-app-production.up.railway.app'

  // Si hay error de OAuth, redirigir al login con el error
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(new URL(`/login?error=${error}`, siteUrl))
  }

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(new URL('/login?error=no_code', siteUrl))
  }

  const cookieStore = await cookies()
  
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
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )
  
  try {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Supabase exchange error:', exchangeError.message, exchangeError)
      return NextResponse.redirect(new URL(`/login?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`, siteUrl))
    }

    if (!data.session) {
      console.error('No session returned after exchange')
      return NextResponse.redirect(new URL('/login?error=no_session', siteUrl))
    }

    console.log('Session created successfully for user:', data.session.user.email)
    
    // Redirigir al dashboard después de login exitoso
    return NextResponse.redirect(new URL('/dashboard', siteUrl))
    
  } catch (err: any) {
    console.error('Supabase exchange exception:', err.message || err)
    return NextResponse.redirect(new URL(`/login?error=exception&message=${encodeURIComponent(err.message || 'Unknown error')}`, siteUrl))
  }
}
