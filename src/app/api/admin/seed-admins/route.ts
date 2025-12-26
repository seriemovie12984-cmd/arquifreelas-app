import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  // Safety: this endpoint is only active when ENABLE_DB_SEED='true'
  // It requires a token header 'x-seed-token' === process.env.SEED_TOKEN
  if (process.env.ENABLE_DB_SEED !== 'true') {
    return NextResponse.json({ error: 'Seed disabled' }, { status: 403 })
  }

  const token = request.headers.get('x-seed-token')
  if (!token || token !== process.env.SEED_TOKEN) {
    return NextResponse.json({ error: 'Invalid or missing seed token' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as { emails?: string[] }
  const emails = (body.emails && Array.isArray(body.emails) && body.emails.length) ? body.emails : ['arquifreelas1@gmail.com','alex6gavalda@gmail.com']

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('[seed-admins] Missing env vars', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!serviceKey,
      urlPreview: supabaseUrl?.substring(0, 30),
      keyPreview: serviceKey?.substring(0, 30)
    })
    return NextResponse.json({ error: 'Supabase service role key missing', hasUrl: !!supabaseUrl, hasKey: !!serviceKey }, { status: 500 })
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  try {
    // First, ensure the profiles table exists by creating it if needed
    const createTableSQL = `
      create table if not exists public.profiles (
        id uuid not null primary key references auth.users on delete cascade,
        email text unique,
        full_name text,
        avatar_url text,
        role text default 'user',
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );
      alter table public.profiles enable row level security;
    `
    
    // Try to create table first (via RPC if available, otherwise ignore)
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await supabase.rpc('sql', { q: createTableSQL })
    } catch {
      // RPC might not exist, that's ok - table might already exist
      console.log('[seed-admins] RPC sql not available, proceeding with update')
    }

    // Use simple query via from().update() with proper error handling
    const { data, error: updErr } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .in('email', emails)

    if (updErr) {
      console.error('[seed-admins] Update error:', updErr)
      return NextResponse.json({ error: 'Update failed', details: updErr.message }, { status: 500 })
    }

    console.log('[seed-admins] Successfully marked admins:', emails)
    return NextResponse.json({ ok: true, emails, data })
  } catch (err) {
    console.error('[seed-admins] Exception:', err)
    return NextResponse.json({ error: 'exception', details: String(err) }, { status: 500 })
  }
}