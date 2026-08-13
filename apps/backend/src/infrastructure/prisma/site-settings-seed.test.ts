import { describe, expect, it } from 'vitest'
import { buildSiteSettingsSeedFromEnv } from './site-settings-seed.js'

describe('buildSiteSettingsSeedFromEnv', () => {
  it('usa env como seed e defaults quando a chave está vazia', () => {
    const seed = buildSiteSettingsSeedFromEnv({
      NUXT_PUBLIC_SITE_URL: 'https://razconms.com.br',
      NUXT_PUBLIC_SITE_NAME: 'Razcon',
      NUXT_PUBLIC_NO_INDEX: 'true',
      NUXT_PUBLIC_CONTACT_EMAIL: '',
      NUXT_PUBLIC_WHATSAPP_NUMBER: '5567999999999'
    })

    expect(seed.siteUrl).toBe('https://razconms.com.br')
    expect(seed.siteName).toBe('Razcon')
    expect(seed.noIndex).toBe(true)
    expect(seed.contactEmail).toBe('contato@razconms.com.br')
    expect(seed.whatsappNumber).toBe('5567999999999')
    expect(seed.seoLocality).toBe('Brasil')
  })

  it('respeita noIndex false explícito', () => {
    const seed = buildSiteSettingsSeedFromEnv({
      NUXT_PUBLIC_NO_INDEX: 'false'
    })
    expect(seed.noIndex).toBe(false)
  })
})
