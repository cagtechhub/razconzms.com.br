import { z } from 'zod'

export const leadChannelSchema = z.enum([
  'WEBSITE',
  'WHATSAPP',
  'INSTAGRAM',
  'FACEBOOK',
  'REFERRAL',
  'OTHER'
])

export const leadStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'LOST'
])

export const createLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).optional().nullable(),
  phone: z.string().trim().min(8).max(40).optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
  channel: leadChannelSchema.default('WEBSITE'),
  status: leadStatusSchema.default('NEW'),
  contactId: z.string().optional().nullable()
})

export const updateLeadSchema = createLeadSchema.partial()

export const leadSchema = createLeadSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type LeadChannel = z.infer<typeof leadChannelSchema>
export type LeadStatus = z.infer<typeof leadStatusSchema>
export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
export type Lead = z.infer<typeof leadSchema>
