#!/bin/bash

# Configurar variables de entorno en Railway
# Este script debe ser ejecutado después de crear el proyecto en Railway

echo "Configurando variables de entorno en Railway..."

# Variables a configurar
NEXT_PUBLIC_SUPABASE_URL="https://wfmwbvgntfuivbdudsub.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbXdidmdudGZ1aXZiZHVkc3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MjU0OTYsImV4cCI6MjA1MDUwMTQ5Nn0.QVpZmqjJPcTguLpb_kPhBL9wQDcXpHPUDlXQDIlkDm4"
NEXT_PUBLIC_SITE_URL="https://arquifreelas-app-production.up.railway.app"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51Shb0y74mNt5qn7D3NfZN5bvwxqUdhJBKD8qAW1C00v9smxm3FnT5oJTOeY3Ks6xRZ0mS2vu6eXZ8WqZZ0yLqZqM00Ep4w2qLn"

echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=***"
echo "NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL"
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"

echo ""
echo "Por favor, configura estas variables en el dashboard de Railway:"
echo "1. Ve a https://railway.app"
echo "2. Selecciona tu proyecto"
echo "3. Ve a 'Variables'"
echo "4. Agrega las variables listadas arriba"
echo ""
echo "Variables de entorno configuradas correctamente!"
