import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
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

  try {
    const { data: invoice, error: invoiceErr } = await supabase.from('invoices').select('*').eq('id', id).single()
    if (invoiceErr || !invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    // Mark invoice paid and create transaction
    const { data: upd, error: updErr } = await supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id).select().single()
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

    const { data: tx, error: txErr } = await supabase.from('transactions').insert([{ invoice_id: id, amount: invoice.amount, provider: 'manual_admin', status: 'success', provider_payload: { marked_by: userData.user.id } }]).select().single()
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 })

    return NextResponse.json({ invoice: upd, transaction: tx })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown'
    console.error('Mark paid error', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
