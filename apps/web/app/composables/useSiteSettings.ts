import type { SiteSettings } from '@razconms/shared'

const DEFAULT_SITE_NAME = 'Razcon Soluções Contábeis'
const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Gostaria de saber mais sobre os serviços contábeis da Razcon.'

function mergeSettingsIntoRuntime(settings: SiteSettings) {
  const config = useRuntimeConfig()
  const publicConfig = config.public as Record<string, unknown>

  const merge = (key: string, value: unknown) => {
    if (value === undefined || value === null) return
    if (typeof value === 'string' && value.trim() === '') return
    publicConfig[key] = value
  }

  merge('siteUrl', settings.siteUrl)
  merge('siteName', settings.siteName)
  merge('seoLocality', settings.seoLocality)
  if (typeof settings.noIndex === 'boolean') publicConfig.noIndex = settings.noIndex
  merge('businessAddress', settings.businessAddress)
  merge('businessPhone', settings.businessPhone)
  merge('contactEmail', settings.contactEmail)
  merge('whatsappNumber', settings.whatsappNumber)
  merge('whatsappMessage', settings.whatsappMessage)
  merge('instagramUrl', settings.instagramUrl)
  merge('facebookUrl', settings.facebookUrl)
  merge('linkedinUrl', settings.linkedinUrl)
  merge('defaultOgImageUrl', settings.defaultOgImageUrl)
  merge('ga4MeasurementId', settings.ga4MeasurementId)
  merge('metaPixelId', settings.metaPixelId)
}

export async function loadSiteSettings() {
  const config = useRuntimeConfig()
  const base = resolveApiBase()
  if (!base) return null

  try {
    const settings = await $fetch<SiteSettings>(`${base}/settings`)
    mergeSettingsIntoRuntime(settings)
    return settings
  } catch {
    return {
      siteName: String(config.public.siteName || DEFAULT_SITE_NAME),
      whatsappMessage: String(config.public.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE)
    } as Partial<SiteSettings>
  }
}

export function useSiteSettings() {
  const config = useRuntimeConfig()

  const siteName = computed(() =>
    String(config.public.siteName || DEFAULT_SITE_NAME).trim()
  )
  const contactEmail = computed(() =>
    String(config.public.contactEmail || 'contato@razconms.com.br').trim()
  )
  const businessPhone = computed(() => String(config.public.businessPhone || '').trim())
  const businessAddress = computed(() =>
    String(
      config.public.businessAddress || 'Atendimento para empresas em todo o Brasil'
    ).trim()
  )
  const instagramUrl = computed(() => String(config.public.instagramUrl || '').trim())
  const facebookUrl = computed(() => String(config.public.facebookUrl || '').trim())
  const linkedinUrl = computed(() => String(config.public.linkedinUrl || '').trim())

  return {
    siteName,
    contactEmail,
    businessPhone,
    businessAddress,
    instagramUrl,
    facebookUrl,
    linkedinUrl,
    load: loadSiteSettings
  }
}
