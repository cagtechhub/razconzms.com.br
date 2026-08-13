import { z } from 'zod'

export const siteSettingsSchema = z.object({
  id: z.string(),
  siteUrl: z.string().default(''),
  siteName: z.string().default('Razcon Soluções Contábeis'),
  seoLocality: z.string().default('Brasil'),
  noIndex: z.boolean().default(false),
  businessAddress: z.string().default(''),
  businessPhone: z.string().default(''),
  contactEmail: z.string().default(''),
  whatsappNumber: z.string().default(''),
  whatsappMessage: z.string().default(''),
  instagramUrl: z.string().default(''),
  facebookUrl: z.string().default(''),
  linkedinUrl: z.string().default(''),
  defaultOgImageUrl: z.string().default(''),
  ga4MeasurementId: z.string().default(''),
  metaPixelId: z.string().default(''),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export const updateSiteSettingsSchema = z.object({
  siteUrl: z.string().trim().max(500).optional(),
  siteName: z.string().trim().min(2).max(160).optional(),
  seoLocality: z.string().trim().max(120).optional(),
  noIndex: z.boolean().optional(),
  businessAddress: z.string().trim().max(500).optional(),
  businessPhone: z.string().trim().max(40).optional(),
  contactEmail: z.string().trim().email().or(z.literal('')).optional(),
  whatsappNumber: z.string().trim().max(40).optional(),
  whatsappMessage: z.string().trim().max(500).optional(),
  instagramUrl: z.string().trim().max(500).optional(),
  facebookUrl: z.string().trim().max(500).optional(),
  linkedinUrl: z.string().trim().max(500).optional(),
  defaultOgImageUrl: z.string().trim().max(1000).optional(),
  ga4MeasurementId: z.string().trim().max(40).optional(),
  metaPixelId: z.string().trim().max(40).optional()
})

export type SiteSettings = z.infer<typeof siteSettingsSchema>
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>
