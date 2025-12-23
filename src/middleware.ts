import { NextResponse } from 'next/server'
export function middleware(req) {
  // AÃ±ade verificaciÃ³n de sesiÃ³n aquÃ­. Redirigir a /login si no hay sesiÃ³n
  return NextResponse.next()
}
