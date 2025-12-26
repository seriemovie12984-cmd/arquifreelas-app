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

  try {
    // Basic counts
    const usersCountRes = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    const projectsCountRes = await supabase.from('projects').select('id', { count: 'exact', head: true })
    const invoicesRes = await supabase.from('invoices').select('id, amount, status, paid_at')

    if (usersCountRes.error || projectsCountRes.error || invoicesRes.error) {
      console.error(usersCountRes.error || projectsCountRes.error || invoicesRes.error)
      return NextResponse.json({ error: 'Query error' }, { status: 500 })
    }

    const totalUsers = Number(usersCountRes.count || 0)
    const totalProjects = Number(projectsCountRes.count || 0)

    const invoices = (invoicesRes.data || []) as Array<{ id: string; amount: number | string; status?: string }>
    const totalInvoices = invoices.length
    const totalInvoiced = invoices.reduce((s: number, i: { amount?: number | string }) => s + Number(i.amount || 0), 0)
    const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s: number, i: { amount?: number | string }) => s + Number(i.amount || 0), 0)

    // Commission and payouts (assume fixed commission rate)
    const COMMISSION_RATE = 0.12
    const adminCommission = Number((totalPaid * COMMISSION_RATE).toFixed(2))
    const payoutsDue = Number((totalPaid * (1 - COMMISSION_RATE)).toFixed(2))

    // Per-user stats (top 10 by paid amount)
    const perUser = await supabase.rpc('invoice_totals_by_user')
    // Note: We will fallback if rpc not available
    let topUsers: Array<{ user_id: string; total: number }> = []
    if (!perUser.error && Array.isArray(perUser.data)) {
      topUsers = (perUser.data as Array<{ user_id: string; total: number }>).slice(0, 10)
    }

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalInvoices,
      totalInvoiced,
      totalPaid,
      adminCommission,
      payoutsDue,
      topUsers,
    })
  } catch (err) {
    console.error('Overview error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
