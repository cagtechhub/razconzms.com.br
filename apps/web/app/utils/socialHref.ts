export function socialHref(url: string | null | undefined) {
  const value = url?.trim()
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}
