function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

export function resolveApiBase() {
  const config = useRuntimeConfig()
  const internal = stripTrailingSlash(String(config.apiBase || ''))
  if (import.meta.server && internal) return internal
  return stripTrailingSlash(String(config.public.apiBase || ''))
}
