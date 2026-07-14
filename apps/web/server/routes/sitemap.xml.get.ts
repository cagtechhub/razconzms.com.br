import { getRequestURL } from 'h3'

function noIndexFlag(config: { public?: Record<string, unknown> }) {
  const value = config.public?.noIndex
  return value === true || value === 'true' || value === '1'
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)

  if (noIndexFlag(config as { public?: Record<string, unknown> })) {
    setResponseStatus(event, 404)
    setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
    return 'Not found'
  }

  const configured = String(config.public?.siteUrl || '')
    .trim()
    .replace(/\/$/, '')
  const origin = configured || getRequestURL(event).origin

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(`${origin}/`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>${escapeXml(`${origin}/faq`)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
`
})
