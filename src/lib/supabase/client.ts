import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

// Create the Supabase client lazily on the browser only.
// This avoids importing server-only modules during the build / SSR phase
// which causes prerender errors in environments where env variables
// are not available at build time.
export async function createClient(): Promise<SupabaseClient | null> {
  if (typeof window === 'undefined') {
    // Running on server/build time - do not attempt to create a browser client
    return null
  }

  if (supabaseInstance) return supabaseInstance

  const { createBrowserClient } = await import('@supabase/ssr')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn('Supabase env vars missing in browser runtime')
    return null
  }

  supabaseInstance = createBrowserClient(url, anonKey)
  return supabaseInstance
}
