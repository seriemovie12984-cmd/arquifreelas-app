import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const allowDebug = process.env.ALLOW_DEBUG === 'true'
  if (process.env.NODE_ENV === 'production' && !allowDebug) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const url = new URL(request.url)
  const email = url.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnon) {
    return NextResponse.json({ error: 'Supabase env vars missing' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseAnon)

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', email)
      .limit(1)
      .maybeSingle()

    if (error) return NextResponse.json({ error: 'query error', details: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ found: false })

    return NextResponse.json({ found: true, profile: { id: data.id, email: data.email, role: data.role } })
  } catch (err) {
    return NextResponse.json({ error: 'exception', details: String(err) }, { status: 500 })
  }
}