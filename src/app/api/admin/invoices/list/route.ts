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

  // Admin check
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const profileRes = await supabase.from('profiles').select('role').eq('id', userData.user.id).single()
  if (profileRes.error) return NextResponse.json({ error: 'Profile lookup failed' }, { status: 500 })
  if (profileRes.data?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase.from('invoices').select('id, user_id, description, amount, status, due_date, created_at, paid_at, metadata').order('created_at', { ascending: false }).limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
