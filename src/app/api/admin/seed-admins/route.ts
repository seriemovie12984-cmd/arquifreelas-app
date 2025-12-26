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
    return NextResponse.json({ error: 'Supabase service role key missing' }, { status: 500 })
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceKey)

  try {
    const sql = `update profiles set role = 'admin' where email in (${emails.map(e => `'${e.replace(/'/g, "''")}'`).join(',')})`;
    // Try raw SQL via psql function if available, otherwise use from().update fallback
    let rpcError = null
    try {
      // Some Supabase projects expose an "sql" RPC for running raw queries; try it if available
      // Note: Type cast intentionally avoided to satisfy lint rules
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const rpcRes = await supabase.rpc('sql', { q: sql })
      if (rpcRes.error) rpcError = rpcRes.error
    } catch (e) {
      rpcError = e
    }

    // Fallback to query via from().update if rpc not available or failed
    if (rpcError) {
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .in('email', emails)

      if (updErr) {
        return NextResponse.json({ error: 'Update failed', details: updErr.message }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true, emails })
  } catch (err) {
    return NextResponse.json({ error: 'exception', details: String(err) }, { status: 500 })
  }
}