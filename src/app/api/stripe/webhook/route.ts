import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })

export async function POST(req: Request) {
  // Verificar firma y procesar eventos
  return new Response('ok', { status: 200 })
}
