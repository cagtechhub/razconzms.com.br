import { z } from 'zod'

export const createContactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(8).max(20).optional(),
  message: z.string().trim().max(2000).optional()
})

export const contactSchema = createContactSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date()
})

export type CreateContactInput = z.infer<typeof createContactSchema>
export type Contact = z.infer<typeof contactSchema>
