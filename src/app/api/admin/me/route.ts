import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const profileRes = await supabase.from('profiles').select('id, email, role, created_at').eq('id', userData.user.id).single()
  if (profileRes.error) {
    return NextResponse.json({ error: 'Profile lookup failed', details: profileRes.error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: profileRes.data })
}