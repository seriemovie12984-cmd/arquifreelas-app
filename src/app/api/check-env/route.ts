import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT SET'
  
  return NextResponse.json({
    SUPABASE_URL: supabaseUrl,
    SUPABASE_KEY_FIRST_20: supabaseKey.substring(0, 20),
    SUPABASE_KEY_LAST_10: supabaseKey.substring(supabaseKey.length - 10),
    SUPABASE_KEY_LENGTH: supabaseKey.length,
    EXPECTED_LENGTH: 219,
    IS_PLACEHOLDER: supabaseKey === 'your-supabase-anon-key',
  })
}
