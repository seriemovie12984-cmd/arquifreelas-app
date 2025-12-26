import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  // Authenticate user
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const {
    title,
    category,
    description,
    budget,
    deadline,
    location,
    requirements,
    files,
  } = body

  if (!title || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const insertObj = {
      owner_id: userData.user.id,
      title,
      category,
      description,
      budget: budget ? Number(budget) : null,
      deadline,
      location,
      requirements,
      files: files || [],
      status: 'aberto',
    }

    const { data, error } = await supabase.from('projects').insert([insertObj]).select().single()

    if (error) {
      console.error('Insert error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Exception in /api/projects', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
