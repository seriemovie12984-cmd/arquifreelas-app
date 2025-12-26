# ⚠️ CONFIGURACIÓN DE PRODUCCIÓN - URGENTE

## Estado Actual
El error que ves es porque falta configurar las URLs de callback en Supabase y Google Cloud.

## Paso 1: Configurar Supabase
1. Ve a: https://app.supabase.com
2. Selecciona tu proyecto: `wfmwbvgntfuivbdudsub`
3. Ve a **Authentication** > **URL Configuration**
4. En la sección "Site URL", actualiza a:
   ```
   https://arquifreelas-app-production.up.railway.app
   ```
5. En "Redirect URLs", asegúrate que incluya:
   ```
   https://arquifreelas-app-production.up.railway.app/auth/callback
   http://localhost:3000/auth/callback
   ```
6. Guarda los cambios

## Paso 2: Configurar Google Cloud Console
1. Ve a: https://console.cloud.google.com
2. Ve a **APIs & Services** > **Credentials**
3. Selecciona tu OAuth 2.0 Client ID de Google
4. En "Authorized JavaScript origins", agrega:
   ```
   https://arquifreelas-app-production.up.railway.app
   https://wfmwbvgntfuivbdudsub.supabase.co
   http://localhost:3000
   ```
5. En "Authorized redirect URIs", asegúrate que incluya:
   ```
   https://wfmwbvgntfuivbdudsub.supabase.co/auth/v1/callback
   ```
6. Guarda los cambios

## Paso 3: Verificar configuración
Una vez completados los pasos anteriores, visita:
```
https://arquifreelas-app-production.up.railway.app/api/test-auth
```

Deberías ver un JSON con toda la configuración verificada.

## Notas Importantes
- **No editar variables en Railway directamente** - se obtienen del `.env.local` que se sube al build
- El dominio anterior `https://v-production-554b.up.railway.app` ya no se usa
- Los cambios en Supabase y Google Cloud pueden tardar algunos minutos en aplicarse

## Si Aún Hay Problemas
1. Limpia el caché del navegador (Ctrl+Shift+Delete)
2. Abre en modo incógnito
3. Verifica los logs de Railway en el dashboard
