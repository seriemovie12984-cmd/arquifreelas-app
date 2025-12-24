#!/bin/bash
# Script para configurar variables de entorno en Railway
# Ejecutar este script después de crear el proyecto en Railway

echo "🚀 Configurando variables de entorno en Railway..."
echo ""
echo "Por favor, en el dashboard de Railway (https://railway.app):"
echo "1. Selecciona tu proyecto 'arquifreelas-app'"
echo "2. Ve a 'Variables'"
echo "3. Agrega las siguientes variables (disponibles en .env.local):"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "VARIABLES DE ENTORNO REQUERIDAS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "- NEXT_PUBLIC_SITE_URL"
echo "- GOOGLE_CLIENT_ID"
echo "- GOOGLE_CLIENT_SECRET"
echo "- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏱️  Después de agregar las variables, Railway redesplegará automáticamente"
echo "✅ Esto puede tardar 2-5 minutos"
echo ""

