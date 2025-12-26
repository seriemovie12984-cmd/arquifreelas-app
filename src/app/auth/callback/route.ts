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
  
  // Crear respuesta para poder establecer cookies
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
          cookiesToSet.forEach(({ name, value, options }) => {
            // Establecer cookies en la respuesta
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
  
  try {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Supabase exchange error:', exchangeError.message)
      return NextResponse.redirect(new URL(`/login?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`, siteUrl))
    }

    console.log('Session created successfully')
    return response
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Supabase exchange exception:', errorMessage)
    return NextResponse.redirect(new URL(`/login?error=exception&message=${encodeURIComponent(errorMessage)}`, siteUrl))
  }
}
