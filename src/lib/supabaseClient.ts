import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente de Supabase básico
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Para componentes client-side con gestión automática de sesión
export const getSupabaseClient = () => createClientComponentClient()
