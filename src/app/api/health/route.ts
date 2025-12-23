import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2025-12-23-v3',
    message: 'Si ves este mensaje, el deploy funciona correctamente'
  })
}
