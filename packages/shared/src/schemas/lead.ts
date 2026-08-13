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

const emptyToUndefined = (value: unknown) =>
  value === '' || value === undefined || value === null ? undefined : value

export const listLeadsQuerySchema = z.object({
  status: z.preprocess(emptyToUndefined, leadStatusSchema.optional()),
  channel: z.preprocess(emptyToUndefined, leadChannelSchema.optional()),
  q: z.preprocess((value) => {
    if (typeof value !== 'string') return emptyToUndefined(value)
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }, z.string().max(120).optional()),
  limit: z.coerce.number().int().min(1).max(100).default(50)
})

export const leadActivityTypeSchema = z.enum(['CREATED', 'STATUS_CHANGED', 'NOTE_ADDED'])

export const leadActivitySchema = z.object({
  id: z.string(),
  leadId: z.string(),
  type: leadActivityTypeSchema,
  message: z.string(),
  meta: z.unknown().nullable().optional(),
  createdAt: z.coerce.date()
})

export type LeadChannel = z.infer<typeof leadChannelSchema>
export type LeadStatus = z.infer<typeof leadStatusSchema>
export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
export type Lead = z.infer<typeof leadSchema>
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>
export type LeadActivityType = z.infer<typeof leadActivityTypeSchema>
export type LeadActivity = z.infer<typeof leadActivitySchema>
