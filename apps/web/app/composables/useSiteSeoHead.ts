import { useSchemaOrg } from '@unhead/schema-org/vue'

function noIndexEnabled(value: boolean | string | undefined) {
  return value === true || value === 'true' || value === '1'
}

export function useSiteSeoHead(overrides?: { title?: string; description?: string }) {
  const config = useRuntimeConfig()
  const canonicalUrl = useCanonicalUrl()

  const siteName = computed(() =>
    String(config.public.siteName || 'Razcon Soluções Contábeis').trim()
  )
  const locality = computed(() => String(config.public.seoLocality || '').trim())
  const noIndex = computed(() =>
    noIndexEnabled(config.public.noIndex as boolean | string | undefined)
  )
  const pageTitle = computed(
    () => overrides?.title || 'Contabilidade com clareza e confiança'
  )
  const socialTitle = computed(() =>
    overrides?.title
      ? `${overrides.title} | ${siteName.value}`
      : `${siteName.value} | ${pageTitle.value}`
  )
  const description = computed(() => {
    if (overrides?.description) return overrides.description
    const localText = locality.value ? ` Atendimento em ${locality.value}.` : ''
    return `Escritório de contabilidade com foco em obrigações fiscais, folha, lançamentos e orientação para empresas.${localText}`
  })
  const ogImage = computed(() => String(config.public.defaultOgImageUrl || '').trim())

  useSeoMeta({
    title: pageTitle,
    description,
    ogSiteName: siteName,
    ogType: 'website',
    ogLocale: 'pt_BR',
    ogTitle: socialTitle,
    ogDescription: description,
    ogImage,
    ogImageAlt: 'Razcon Soluções Contábeis',
    ogUrl: canonicalUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: socialTitle,
    twitterDescription: description,
    twitterImage: ogImage,
    author: siteName
  })

  useSchemaOrg(() => {
    const phone = String(
      config.public.businessPhone || config.public.whatsappNumber || ''
    ).replace(/\D/g, '')
    const tel = phone ? `+${phone}` : ''
    const contactEmail = String(config.public.contactEmail || '').trim()
    const instagram = String(config.public.instagramUrl || '').trim()
    const facebook = String(config.public.facebookUrl || '').trim()
    const linkedin = String(config.public.linkedinUrl || '').trim()
    const sameAs = [instagram, facebook, linkedin].filter(Boolean)

    const organization: Record<string, unknown> = {
      '@type': 'AccountingService',
      '@id': `${canonicalUrl.value}#organization`,
      name: siteName.value,
      url: canonicalUrl.value,
      description: description.value,
      ...(ogImage.value ? { image: ogImage.value } : {}),
      areaServed: 'BR',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        ...(locality.value ? { addressLocality: locality.value } : {})
      }
    }

    if (tel) organization.telephone = tel
    if (sameAs.length) organization.sameAs = sameAs
    if (contactEmail || tel) {
      organization.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        areaServed: 'BR',
        availableLanguage: 'Portuguese',
        ...(contactEmail ? { email: contactEmail } : {}),
        ...(tel ? { telephone: tel } : {})
      }
    }

    return [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${canonicalUrl.value}#website`,
        url: canonicalUrl.value,
        name: siteName.value,
        description: description.value,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${canonicalUrl.value}#organization` }
      }
    ]
  })

  useHead(() => ({
    meta: [
      {
        name: 'robots',
        content: noIndex.value
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      }
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ]
  }))
}
