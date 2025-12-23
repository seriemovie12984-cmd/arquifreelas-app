# Guía de Configuración - Auth + Pagos

## 🚀 Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto se inicialice (2-3 minutos)

### 2. Ejecutar migración SQL

1. En el panel de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase_migrations/create_profiles.sql`
3. Copia y pega el contenido en el editor
4. Haz clic en **Run** para ejecutar la migración

### 3. Configurar Google OAuth

1. Ve a **Authentication → Providers** en Supabase
2. Busca **Google** y habilítalo
3. Sigue las instrucciones para crear OAuth credentials en Google Cloud Console:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un proyecto (o usa uno existente)
   - Habilita **Google+ API**
   - Ve a **Credentials → Create Credentials → OAuth client ID**
   - Tipo: **Web application**
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
4. Copia el **Client ID** y **Client Secret** y pégalos en Supabase
5. Guarda los cambios

### 4. Obtener las claves de Supabase

1. Ve a **Settings → API** en Supabase
2. Copia las siguientes claves:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 💳 Configuración de Stripe

### 1. Crear cuenta en Stripe

1. Ve a [https://stripe.com](https://stripe.com) y crea una cuenta
2. Completa el proceso de registro
3. Activa el **modo de prueba** (toggle en la parte superior)

### 2. Crear productos y precios

1. Ve a **Products** en el dashboard de Stripe
2. Crea un nuevo producto:
   - **Name**: Plan Básico (o como quieras llamarlo)
   - **Description**: Descripción del plan
3. Añade un precio:
   - **Pricing model**: Recurring (suscripción)
   - **Price**: Define el precio (ej: $29/mes)
   - **Billing period**: Monthly
4. Guarda el producto y **copia el Price ID** (formato: `price_xxxxx`)

### 3. Obtener claves API

1. Ve a **Developers → API keys** en Stripe
2. Copia las siguientes claves (modo test):
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### 4. Configurar Webhook (para producción)

**Para desarrollo local:**
```bash
# Instalar Stripe CLI
npm install -g stripe-cli

# Login en Stripe
stripe login

# Forward webhooks a localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia el **webhook signing secret** que aparece → `STRIPE_WEBHOOK_SECRET`

**Para producción (Railway/Vercel):**
1. Ve a **Developers → Webhooks** en Stripe
2. Crea un endpoint: `https://tu-dominio.com/api/stripe/webhook`
3. Selecciona los eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 🔧 Configurar Variables de Entorno

### En Railway

```bash
cd F:\VisualStudio\ArquiFreelas\arquifreelas-app

railway login
railway link

# Añadir variables
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
railway variables set SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."
railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
railway variables set STRIPE_SECRET_KEY="sk_test_xxx"
railway variables set STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Redesplegar
railway up
```

### En Vercel

1. Ve al dashboard de tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade las 6 variables mencionadas arriba
4. Redespliega el proyecto

### Local (.env.local)

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

⚠️ **IMPORTANTE**: Nunca hagas commit de `.env.local` (ya está en `.gitignore`)

---

## ✅ Verificar configuración

1. **Iniciar dev server:**
   ```bash
   npm run dev
   ```

2. **Probar login con Google:**
   - Ve a http://localhost:3000/login
   - Haz clic en "Entrar com Google"
   - Deberías ser redirigido al dashboard

3. **Verificar perfil en Supabase:**
   - Ve a **Table Editor → profiles** en Supabase
   - Deberías ver tu perfil creado

4. **Probar checkout de Stripe:**
   - Crear una página de planes con botón de checkout
   - Usar el Price ID creado en Stripe
   - Probar con tarjetas de prueba de Stripe: `4242 4242 4242 4242`

---

## 🧪 Tarjetas de prueba de Stripe

- **Éxito**: 4242 4242 4242 4242
- **Fallo**: 4000 0000 0000 0002
- **3D Secure**: 4000 0027 6000 3184
- Fecha: cualquier fecha futura
- CVC: cualquier 3 dígitos
- ZIP: cualquier 5 dígitos

---

## 📚 Recursos

- [Documentación Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentación Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 🆘 Troubleshooting

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctamente configuradas
- Revisa que no haya espacios al inicio/final de las claves

### Login con Google no funciona
- Verifica que el redirect URI en Google Cloud Console coincida con tu URL de Supabase
- Revisa que Google OAuth esté habilitado en Supabase

### Webhook no funciona
- Para desarrollo local, asegúrate de que `stripe listen` esté corriendo
- Para producción, verifica que el endpoint sea accesible públicamente
- Revisa los logs de Stripe para ver detalles de errores

### Error de CORS
- Verifica que la URL de callback esté correctamente configurada en Supabase
- Añade tu dominio a los **Allowed origins** en Supabase

---

¿Necesitas ayuda? Abre un issue en el repositorio.
