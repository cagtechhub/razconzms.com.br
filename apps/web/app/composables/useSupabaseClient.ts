import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function useSupabaseClient() {
  const config = useRuntimeConfig()

  const url = String(config.public.supabaseUrl || '').trim()
  const anonKey = String(config.public.supabaseAnonKey || '').trim()

  if (!url || !anonKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Supabase não configurado. Defina NUXT_PUBLIC_SUPABASE_URL e NUXT_PUBLIC_SUPABASE_ANON_KEY.'
    })
  }

  if (import.meta.client) {
    if (!browserClient) {
      browserClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: 'razconms-admin-auth'
        }
      })
    }
    return browserClient
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}
