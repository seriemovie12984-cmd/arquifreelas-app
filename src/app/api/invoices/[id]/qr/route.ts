import QRCode from 'qrcode'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://arquifreelas-app-production.up.railway.app'
  const url = `${host}/invoices/${id}`

  try {
    // generate PNG buffer for QR encoding the public invoice URL
    const buffer = await QRCode.toBuffer(url, { type: 'png', width: 300 })
    // TypeScript complains about Buffer vs BodyInit; cast to BodyInit explicitly
    return new NextResponse(buffer as unknown as BodyInit, { status: 200, headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' } })
  } catch (err) {
    console.error('QR generation error', err)
    return NextResponse.json({ error: 'QR generation failed' }, { status: 500 })
  }
}
