import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })

export async function POST(req: Request) {
  const { priceId, userId } = await req.json()
  // Implementar: buscar profile, crear customer si no existe, crear session
  return new Response(JSON.stringify({ message: 'Implementar lÃ³gica de Checkout aquÃ­' }), { status: 200 })
}
