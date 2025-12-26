import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll() { return cookieStore.getAll() } } })

  const id = params.id
  const { data: invoice, error } = await supabase.from('invoices').select('*').eq('id', id).single()
  if (error || !invoice) {
    return (<main className="min-h-screen flex items-center justify-center"><div className="text-center">Invoice not found</div></main>)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Fatura #{String(invoice.id).slice(0,8)}</h1>
        <p className="text-gray-700 mb-2">Descrição: {invoice.description || '—'}</p>
        <p className="text-gray-700 mb-2">Valor: R$ {Number(invoice.amount).toFixed(2)}</p>
        <p className="text-gray-700 mb-2">Vencimento: {invoice.due_date || '—'}</p>
        <p className="text-gray-700 mb-4">Status: {invoice.status}</p>

        <div className="text-center">
          <img src={`/api/invoices/${invoice.id}/qr`} alt="QR de pagamento Pix" className="mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Escaneie o QR para abrir esta página no celular e pagar via Pix.</p>
        </div>

        <div className="mt-6 flex justify-between">
          <Link href="/" className="text-[#22C55E] hover:underline">Voltar</Link>
          <a href={`/api/invoices/${invoice.id}/qr`} className="text-sm text-gray-500">Baixar QR</a>
        </div>
      </div>
    </main>
  )
}
