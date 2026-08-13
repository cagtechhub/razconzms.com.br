import type { SiteSettings } from '@razconms/shared'

const DEFAULT_SITE_NAME = 'Razcon Soluções Contábeis'
const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Gostaria de saber mais sobre os serviços contábeis da Razcon.'

export type PublicSiteSettingsState = {
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

const asString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback

const asBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === '1') return true
  if (value === 'false' || value === '0') return false
  return fallback
}

export function overlaySiteSettings(settings: SiteSettings): PublicSiteSettingsState {
  return {
    siteUrl: settings.siteUrl ?? '',
    siteName: settings.siteName ?? '',
    seoLocality: settings.seoLocality ?? '',
    noIndex: Boolean(settings.noIndex),
    businessAddress: settings.businessAddress ?? '',
    businessPhone: settings.businessPhone ?? '',
    contactEmail: settings.contactEmail ?? '',
    whatsappNumber: settings.whatsappNumber ?? '',
    whatsappMessage: settings.whatsappMessage ?? '',
    instagramUrl: settings.instagramUrl ?? '',
    facebookUrl: settings.facebookUrl ?? '',
    linkedinUrl: settings.linkedinUrl ?? '',
    defaultOgImageUrl: settings.defaultOgImageUrl ?? '',
    ga4MeasurementId: settings.ga4MeasurementId ?? '',
    metaPixelId: settings.metaPixelId ?? ''
  }
}

function fromRuntimeConfig(): PublicSiteSettingsState {
  const config = useRuntimeConfig()
  const publicConfig = config.public as Record<string, unknown>
  return {
    siteUrl: asString(publicConfig.siteUrl),
    siteName: asString(publicConfig.siteName, DEFAULT_SITE_NAME),
    seoLocality: asString(publicConfig.seoLocality, 'Brasil'),
    noIndex: asBoolean(publicConfig.noIndex),
    businessAddress: asString(publicConfig.businessAddress),
    businessPhone: asString(publicConfig.businessPhone),
    contactEmail: asString(publicConfig.contactEmail, 'contato@razconms.com.br'),
    whatsappNumber: asString(publicConfig.whatsappNumber),
    whatsappMessage: asString(publicConfig.whatsappMessage, DEFAULT_WHATSAPP_MESSAGE),
    instagramUrl: asString(publicConfig.instagramUrl),
    facebookUrl: asString(publicConfig.facebookUrl),
    linkedinUrl: asString(publicConfig.linkedinUrl),
    defaultOgImageUrl: asString(publicConfig.defaultOgImageUrl),
    ga4MeasurementId: asString(publicConfig.ga4MeasurementId),
    metaPixelId: asString(publicConfig.metaPixelId)
  }
}

export function useSiteSettingsState() {
  return useState<PublicSiteSettingsState>('site-settings', fromRuntimeConfig)
}

export async function loadSiteSettings() {
  const state = useSiteSettingsState()
  const base = resolveApiBase()
  if (!base) return state.value

  try {
    const settings = await $fetch<SiteSettings>(`${base}/settings`)
    state.value = overlaySiteSettings(settings)
    return settings
  } catch {
    return state.value
  }
}

export function useSiteSettings() {
  const state = useSiteSettingsState()

  return {
    siteUrl: computed(() => state.value.siteUrl),
    siteName: computed(() => state.value.siteName.trim() || DEFAULT_SITE_NAME),
    seoLocality: computed(() => state.value.seoLocality),
    noIndex: computed(() => state.value.noIndex),
    contactEmail: computed(() => state.value.contactEmail),
    businessPhone: computed(() => state.value.businessPhone),
    businessAddress: computed(() => state.value.businessAddress),
    whatsappNumber: computed(() => state.value.whatsappNumber),
    whatsappMessage: computed(
      () => state.value.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE
    ),
    instagramUrl: computed(() => state.value.instagramUrl),
    facebookUrl: computed(() => state.value.facebookUrl),
    linkedinUrl: computed(() => state.value.linkedinUrl),
    defaultOgImageUrl: computed(() => state.value.defaultOgImageUrl),
    ga4MeasurementId: computed(() => state.value.ga4MeasurementId),
    metaPixelId: computed(() => state.value.metaPixelId),
    load: loadSiteSettings
  }
}
