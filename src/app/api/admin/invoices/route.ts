import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  // Verify admin
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const profileRes = await supabase.from('profiles').select('role').eq('id', userData.user.id).single()
  if (profileRes.error) return NextResponse.json({ error: 'Profile lookup failed' }, { status: 500 })
  if (profileRes.data?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { user_id, project_id, description, amount, due_date } = body
  if (!user_id || !amount) return NextResponse.json({ error: 'missing fields' }, { status: 400 })

  const { data, error } = await supabase.from('invoices').insert([{ user_id, project_id: project_id || null, description: description || null, amount, due_date: due_date || null }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
