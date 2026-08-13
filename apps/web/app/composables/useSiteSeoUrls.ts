function normalizeOrigin(value: string) {
  return value.trim().replace(/\/$/, '')
}

export function usePublicSiteOrigin() {
  const { siteUrl } = useSiteSettings()
  const requestUrl = import.meta.server ? useRequestURL() : null

  return computed(() => {
    const configured = normalizeOrigin(siteUrl.value)
    if (configured) return configured
    if (requestUrl) return normalizeOrigin(requestUrl.origin)
    return window.location.origin.replace(/\/$/, '')
  })
}

export function useCanonicalUrl(path = '/') {
  const origin = usePublicSiteOrigin()

  return computed(() => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${origin.value}${cleanPath}`
  })
}
