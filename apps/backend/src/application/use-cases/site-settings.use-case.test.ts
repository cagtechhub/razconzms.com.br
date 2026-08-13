import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import type { SiteSettings } from '@razconms/shared'
import { SiteSettingsRepository } from '../site-settings-repository.context.js'
import { getSiteSettings, updateSiteSettings } from './site-settings.use-case.js'

const sample: SiteSettings = {
  id: 'default',
  siteUrl: '',
  siteName: 'Razcon Soluções Contábeis',
  seoLocality: 'Brasil',
  noIndex: false,
  businessAddress: '',
  businessPhone: '',
  contactEmail: 'contato@razconms.com.br',
  whatsappNumber: '',
  whatsappMessage: '',
  instagramUrl: '',
  facebookUrl: '',
  linkedinUrl: '',
  defaultOgImageUrl: '',
  ga4MeasurementId: '',
  metaPixelId: '',
  createdAt: new Date('2026-08-12T12:00:00.000Z'),
  updatedAt: new Date('2026-08-12T12:00:00.000Z')
}

describe('siteSettings', () => {
  it.effect('retorna o singleton', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(SiteSettingsRepository, {
        get: () => Effect.succeed(sample),
        update: () => Effect.die('unused')
      })

      const result = yield* getSiteSettings.pipe(Effect.provide(layer))
      assert.strictEqual(result.siteName, 'Razcon Soluções Contábeis')
    })
  )

  it.effect('atualiza whatsapp', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(SiteSettingsRepository, {
        get: () => Effect.succeed(sample),
        update: (input) =>
          Effect.succeed({
            ...sample,
            whatsappNumber: input.whatsappNumber ?? sample.whatsappNumber,
            updatedAt: new Date('2026-08-12T13:00:00.000Z')
          })
      })

      const result = yield* updateSiteSettings({ whatsappNumber: '5567999999999' }).pipe(
        Effect.provide(layer)
      )

      assert.strictEqual(result.whatsappNumber, '5567999999999')
    })
  )
})
