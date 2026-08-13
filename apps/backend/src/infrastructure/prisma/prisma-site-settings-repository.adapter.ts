import {
  siteSettingsSchema,
  type SiteSettings,
  type UpdateSiteSettingsInput
} from '@razconms/shared'
import type { SiteSettingsRepositoryPort } from '../../application/ports/site-settings-repository.port.js'
import { InfraError } from '../../domain/errors/infra-error.js'
import { Effect } from 'effect'
import type { PrismaClient } from './output/client.js'

const DEFAULT_SETTINGS_ID = 'default'

const mapSettings = (record: {
  id: string
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
  createdAt: Date
  updatedAt: Date
}): SiteSettings => siteSettingsSchema.parse(record)

export const makePrismaSiteSettingsRepository = (
  prisma: PrismaClient
): SiteSettingsRepositoryPort => ({
  get: () =>
    Effect.tryPromise({
      try: async () => {
        const existing = await prisma.siteSettings.findFirst({
          orderBy: { createdAt: 'asc' }
        })
        if (existing) return existing
        return prisma.siteSettings.create({
          data: { id: DEFAULT_SETTINGS_ID }
        })
      },
      catch: (cause) => new InfraError('Failed to get site settings', cause)
    }).pipe(Effect.map(mapSettings)),

  update: (input: UpdateSiteSettingsInput) =>
    Effect.tryPromise({
      try: async () => {
        const existing = await prisma.siteSettings.findFirst({
          orderBy: { createdAt: 'asc' }
        })
        if (!existing) {
          return prisma.siteSettings.create({
            data: {
              id: DEFAULT_SETTINGS_ID,
              ...input
            }
          })
        }
        return prisma.siteSettings.update({
          where: { id: existing.id },
          data: input
        })
      },
      catch: (cause) => new InfraError('Failed to update site settings', cause)
    }).pipe(Effect.map(mapSettings))
})
