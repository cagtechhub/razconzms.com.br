import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let authClient: SupabaseClient | null = null

export const getSupabaseAuthClient = (): SupabaseClient => {
  if (authClient) return authClient
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase Auth não configurado. Defina SUPABASE_URL e SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_ROLE_KEY).'
    )
  }
  authClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
  return authClient
}

export const parseAllowedAdminEmails = (): Set<string> | null => {
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim()
  if (!raw) return null
  const emails = raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  return emails.length ? new Set(emails) : null
}
