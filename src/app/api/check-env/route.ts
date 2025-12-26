import { NextResponse } from 'next/server'

export async function GET() {
  // Only expose full env data in non-production or when explicitly allowed
  const allowDebug = process.env.ALLOW_DEBUG === 'true'
  if (process.env.NODE_ENV === 'production' && !allowDebug) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT SET'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'
  
  return NextResponse.json({
    SUPABASE_URL: supabaseUrl,
    SUPABASE_KEY_FIRST_20: supabaseKey.substring(0, 20),
    SUPABASE_KEY_LAST_10: supabaseKey.substring(supabaseKey.length - 10),
    SUPABASE_KEY_LENGTH: supabaseKey.length,
    SITE_URL: siteUrl,
    IS_VALID: supabaseKey.length > 100 && supabaseUrl.includes('supabase'),
  })
}
