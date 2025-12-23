import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session si existe
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/projetos']
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirigir a login si no hay sesión y está intentando acceder a ruta protegida
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirigir a dashboard si ya está autenticado e intenta acceder a login/cadastro
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/cadastro')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projetos/:path*',
    '/login',
    '/cadastro',
  ],
}
