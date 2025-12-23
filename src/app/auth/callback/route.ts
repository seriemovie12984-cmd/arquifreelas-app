import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    
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
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Handle error silently
            }
          },
        },
      }
    )
    
    try {
      const result = await supabase.auth.exchangeCodeForSession(code)

      if (result.error) {
        console.error('Supabase exchange error:', result.error)
        // Redirect back to login with a short error code for diagnostics
        return NextResponse.redirect(new URL('/login?error=exchange_failed', request.url))
      }

      console.log('Supabase exchange success for code source:', request.url)
    } catch (err) {
      console.error('Supabase exchange exception:', err)
      return NextResponse.redirect(new URL('/login?error=exchange_exception', request.url))
    }
  }

  // URL para redirigir después de login exitoso
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
