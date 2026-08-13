function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

export function resolveApiBase() {
  const config = useRuntimeConfig()
  if (import.meta.server) {
    const internal = stripTrailingSlash(String(config.apiBase || ''))
    if (internal) return internal
  }
  return stripTrailingSlash(String(config.public.apiBase || ''))
}

export function useApiBase() {
  return computed(() => resolveApiBase())
}
