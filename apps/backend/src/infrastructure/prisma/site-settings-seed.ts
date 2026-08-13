export type SiteSettingsSeed = {
  siteUrl: string
  siteName: string
  seoLocality: string
  noIndex: boolean
  businessAddress: string
  businessPhone: string
  contactEmail: string
  whatsappNumber: string
  whatsappMessage: string
  instagramUrl: string
  facebookUrl: string
  linkedinUrl: string
  defaultOgImageUrl: string
  ga4MeasurementId: string
  metaPixelId: string
}

const DEFAULT_SITE_NAME = 'Razcon Soluções Contábeis'
const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Gostaria de saber mais sobre os serviços contábeis da Razcon.'

const str = (env: Record<string, string | undefined>, key: string, fallback = '') =>
  env[key]?.trim() || fallback

const bool = (env: Record<string, string | undefined>, key: string, fallback = false) => {
  const value = env[key]?.trim().toLowerCase()
  if (value === 'true' || value === '1') return true
  if (value === 'false' || value === '0') return false
  return fallback
}

export const buildSiteSettingsSeedFromEnv = (
  env: Record<string, string | undefined> = process.env
): SiteSettingsSeed => ({
  siteUrl: str(env, 'NUXT_PUBLIC_SITE_URL'),
  siteName: str(env, 'NUXT_PUBLIC_SITE_NAME', DEFAULT_SITE_NAME),
  seoLocality: str(env, 'NUXT_PUBLIC_SEO_LOCALITY', 'Brasil'),
  noIndex: bool(env, 'NUXT_PUBLIC_NO_INDEX', false),
  businessAddress: str(env, 'NUXT_PUBLIC_BUSINESS_ADDRESS'),
  businessPhone: str(env, 'NUXT_PUBLIC_BUSINESS_PHONE'),
  contactEmail: str(env, 'NUXT_PUBLIC_CONTACT_EMAIL', 'contato@razconms.com.br'),
  whatsappNumber: str(env, 'NUXT_PUBLIC_WHATSAPP_NUMBER'),
  whatsappMessage: str(env, 'NUXT_PUBLIC_WHATSAPP_MESSAGE', DEFAULT_WHATSAPP_MESSAGE),
  instagramUrl: str(env, 'NUXT_PUBLIC_INSTAGRAM_URL'),
  facebookUrl: str(env, 'NUXT_PUBLIC_FACEBOOK_URL'),
  linkedinUrl: str(env, 'NUXT_PUBLIC_LINKEDIN_URL'),
  defaultOgImageUrl: str(env, 'NUXT_PUBLIC_DEFAULT_OG_IMAGE_URL'),
  ga4MeasurementId: str(env, 'NUXT_PUBLIC_GA4_MEASUREMENT_ID'),
  metaPixelId: str(env, 'NUXT_PUBLIC_META_PIXEL_ID')
})
