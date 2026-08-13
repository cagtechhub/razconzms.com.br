import { z } from 'zod'

export const createPlanSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(2).max(500),
  features: z.array(z.string().trim().min(1).max(160)).min(1).max(20),
  featured: z.boolean().default(false),
  showPrice: z.boolean().default(true),
  priceOriginalCents: z.number().int().min(0).max(99_999_999).optional().nullable(),
  pricePromoCents: z.number().int().min(0).max(99_999_999).optional().nullable(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  active: z.boolean().default(true),
  ctaLabel: z.string().trim().max(80).optional().nullable()
})

export const updatePlanSchema = createPlanSchema.partial()

export const planSchema = createPlanSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type CreatePlanInput = z.infer<typeof createPlanSchema>
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>
export type Plan = z.infer<typeof planSchema>
