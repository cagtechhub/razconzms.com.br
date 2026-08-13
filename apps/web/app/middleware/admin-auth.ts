export default defineNuxtRouteMiddleware(async () => {
  const token = useCookie<string | null>('admin_token')

  if (import.meta.client) {
    try {
      const supabase = useSupabaseClient()
      const { data } = await supabase.auth.getSession()
      token.value = data.session?.access_token ?? null
    } catch {
      token.value = null
    }
  }

  if (!token.value) {
    return navigateTo('/admin/login')
  }
})
