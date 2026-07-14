import { getRequestURL } from 'h3'

function noIndexFlag(config: { public?: Record<string, unknown> }) {
  const value = config.public?.noIndex
  return value === true || value === 'true' || value === '1'
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const configured = String(config.public?.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  const origin = configured || getRequestURL(event).origin

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')

  if (noIndexFlag(config as { public?: Record<string, unknown> })) {
    return `User-agent: *
Disallow: /
`
  }

  return `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
})
