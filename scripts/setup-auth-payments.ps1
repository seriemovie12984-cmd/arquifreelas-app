# scripts/setup-auth-payments.ps1
param()
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Output "Iniciando: verificando repo git..."

# Detectar root del repo (si no estás en un repo, pide que ejecutes desde la carpeta correcta)
try {
    $gitRoot = (git rev-parse --show-toplevel) -replace "`n","" -replace "`r",""
} catch {
    Write-Error "No se detectó un repo Git. Por favor ejecuta este script desde la raíz del repo (donde está .git)."
    exit 1
}

Set-Location $gitRoot
Write-Output "Directorio del repo: $gitRoot"

Write-Output "1/7 - Instalando dependencias..."
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs stripe --save

# Función para crear carpeta si no existe
function Ensure-Dir([string]$path){
    if (-not (Test-Path $path)) {
        Write-Output "Creando carpeta: $path"
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    } else { Write-Output "Existe: $path" }
}

Write-Output "2/7 - Creando carpetas y archivos de ejemplo..."
Ensure-Dir -path "$gitRoot\src\lib"
Ensure-Dir -path "$gitRoot\supabase_migrations"
Ensure-Dir -path "$gitRoot\src\app\api\stripe\create-checkout"
Ensure-Dir -path "$gitRoot\src\app\api\stripe\webhook"
Ensure-Dir -path "$gitRoot\src\app\(auth)\login"
Ensure-Dir -path "$gitRoot\src\app"

# Archivo: supabaseClient.ts
$supabaseCode = @"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
"@
$supabaseCode | Out-File -Encoding UTF8 "$gitRoot\src\lib\supabaseClient.ts" -Force

# Migración SQL
$sql = @"
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  full_name text,
  avatar_url text,
  provider text,
  stripe_customer_id text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);
"@
$sql | Out-File -Encoding UTF8 "$gitRoot\supabase_migrations\create_profiles.sql" -Force

# Endpoint simplificado de checkout
$checkout = @"
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })

export async function POST(req: Request) {
  const { priceId, userId } = await req.json()
  // Implementar: buscar profile, crear customer si no existe, crear session
  return new Response(JSON.stringify({ message: 'Implementar lógica de Checkout aquí' }), { status: 200 })
}
"@
$checkout | Out-File -Encoding UTF8 "$gitRoot\src\app\api\stripe\create-checkout\route.ts" -Force

# Webhook file (simplificado)
$webhook = @"
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })

export async function POST(req: Request) {
  // Verificar firma y procesar eventos
  return new Response('ok', { status: 200 })
}
"@
$webhook | Out-File -Encoding UTF8 "$gitRoot\src\app\api\stripe\webhook\route.ts" -Force

# Middleware simplificado para proteger rutas (ajusta según tu app)
$middleware = @"
import { NextResponse } from 'next/server'
export function middleware(req) {
  // Añade verificación de sesión aquí. Redirigir a /login si no hay sesión
  return NextResponse.next()
}
"@
$middleware | Out-File -Encoding UTF8 "$gitRoot\src\middleware.ts" -Force

Write-Output "3/7 - Creando branch de trabajo y commiteando..."
git checkout -b feat/auth-payments

git add -A
git commit -m "feat(auth+payments): add supabase client, migrations, stripe endpoints and middleware (scaffold)"
git push --set-upstream origin feat/auth-payments

Write-Output "4/7 - Abriendo PR..."
gh pr create --title "feat: add Supabase auth (Google) + Stripe scaffold" --body "Automated PR scaffold: supabase client, migration, stripe endpoints, middleware. Needs env vars and implementation details." --base main

Write-Output "5/7 - NOTAS IMPORTANTES"
Write-Output "- Añade las variables de entorno en Railway/host: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET"
Write-Output "- Ejecuta las migraciones en Supabase (usa supabase CLI o panel)"
Write-Output "- Implementa lógica real en los endpoints (creación de customer, sessions, verificación de webhooks)"
Write-Output "- Para probar webhooks localmente: 'stripe listen --forward-to localhost:3000/api/stripe/webhook'"

Write-Output "6/7 - Completado: revisa el PR y completa la implementación."
Write-Output "Si necesitas, puedo añadir la lógica completa y tests en el PR cuando confirmes que pusiste las variables en el host."
