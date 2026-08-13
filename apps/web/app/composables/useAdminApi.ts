import {
  createLeadSchema,
  createTeamMemberSchema,
  updateLeadSchema,
  updateSiteSettingsSchema,
  updateTeamMemberSchema,
  type AdminDashboardStats,
  type CreateLeadInput,
  type CreateTeamMemberInput,
  type Lead,
  type SiteSettings,
  type TeamMember,
  type UpdateLeadInput,
  type UpdateSiteSettingsInput,
  type UpdateTeamMemberInput
} from '@razconms/shared'

export const useAdminApi = () => {
  const token = useCookie<string | null>('admin_token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  const baseUrl = useApiBase()

  const ensureAccessToken = async (): Promise<string | null> => {
    if (import.meta.client) {
      try {
        const supabase = useSupabaseClient()
        const { data } = await supabase.auth.getSession()
        token.value = data.session?.access_token ?? null
      } catch {
        // keep cookie value
      }
    }
    return token.value
  }

  const authHeaders = async (): Promise<HeadersInit> => {
    const accessToken = await ensureAccessToken()
    if (!accessToken) return {}
    return { Authorization: `Bearer ${accessToken}` }
  }

  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const headers = new Headers(init.headers)
    if (!(init.body instanceof FormData) && !headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json')
    }
    for (const [key, value] of Object.entries(await authHeaders())) {
      headers.set(key, value)
    }

    const response = await fetch(`${baseUrl.value}${path}`, {
      ...init,
      headers
    })

    if (response.status === 204) {
      return undefined as T
    }

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
      }
      throw createError({
        statusCode: response.status,
        statusMessage: data?.message || data?.error || 'Erro na API',
        data
      })
    }
    return data as T
  }

  const login = async (email: string, password: string) => {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })
    if (error || !data.session) {
      throw createError({
        statusCode: 401,
        statusMessage: error?.message || 'E-mail ou senha inválidos'
      })
    }
    token.value = data.session.access_token

    try {
      await request<AdminDashboardStats>('/admin/dashboard')
    } catch (cause: unknown) {
      token.value = null
      try {
        await supabase.auth.signOut()
      } catch {
        // ignore
      }
      const statusCode =
        cause && typeof cause === 'object' && 'statusCode' in cause
          ? Number((cause as { statusCode?: number }).statusCode)
          : 403
      const statusMessage =
        cause && typeof cause === 'object' && 'statusMessage' in cause
          ? String((cause as { statusMessage?: string }).statusMessage)
          : 'Usuário sem permissão de admin'
      throw createError({
        statusCode: statusCode || 403,
        statusMessage:
          statusCode === 403
            ? 'Este e-mail não tem permissão de admin. Inclua-o em ADMIN_ALLOWED_EMAILS no backend.'
            : statusMessage || 'Falha ao validar acesso admin'
      })
    }
  }

  const logout = async () => {
    try {
      if (import.meta.client) {
        await useSupabaseClient().auth.signOut()
      }
    } finally {
      token.value = null
    }
  }

  const isAuthenticated = computed(() => Boolean(token.value))

  const getDashboard = () => request<AdminDashboardStats>('/admin/dashboard')

  const listLeads = () => request<Lead[]>('/admin/leads')
  const createLead = (input: CreateLeadInput) => {
    const parsed = createLeadSchema.safeParse(input)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Lead inválido' })
    }
    return request<Lead>('/admin/leads', {
      method: 'POST',
      body: JSON.stringify(parsed.data)
    })
  }
  const updateLead = (id: string, input: UpdateLeadInput) => {
    const parsed = updateLeadSchema.safeParse(input)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Lead inválido' })
    }
    return request<Lead>(`/admin/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(parsed.data)
    })
  }
  const removeLead = (id: string) =>
    request<undefined>(`/admin/leads/${id}`, { method: 'DELETE' })

  const getSettings = () => request<SiteSettings>('/admin/settings')
  const updateSettings = (input: UpdateSiteSettingsInput) => {
    const parsed = updateSiteSettingsSchema.safeParse(input)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Configurações inválidas' })
    }
    return request<SiteSettings>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(parsed.data)
    })
  }

  const listTeam = () => request<TeamMember[]>('/admin/team')
  const createTeamMember = (input: CreateTeamMemberInput) => {
    const parsed = createTeamMemberSchema.safeParse(input)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Membro inválido' })
    }
    return request<TeamMember>('/admin/team', {
      method: 'POST',
      body: JSON.stringify(parsed.data)
    })
  }
  const updateTeamMember = (id: string, input: UpdateTeamMemberInput) => {
    const parsed = updateTeamMemberSchema.safeParse(input)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Membro inválido' })
    }
    return request<TeamMember>(`/admin/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(parsed.data)
    })
  }
  const removeTeamMember = (id: string) =>
    request<undefined>(`/admin/team/${id}`, { method: 'DELETE' })

  const uploadImage = async (
    file: File,
    folder = 'team'
  ): Promise<{ url: string; path: string; bucket: string }> => {
    const body = new FormData()
    body.append('file', file)
    body.append('folder', folder)
    return request<{ url: string; path: string; bucket: string }>('/admin/uploads', {
      method: 'POST',
      body
    })
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
    getDashboard,
    listLeads,
    createLead,
    updateLead,
    removeLead,
    getSettings,
    updateSettings,
    listTeam,
    createTeamMember,
    updateTeamMember,
    removeTeamMember,
    uploadImage
  }
}
