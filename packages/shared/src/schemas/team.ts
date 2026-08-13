import { z } from 'zod'

const optionalUrl = z.string().trim().max(500).optional().nullable()

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  initials: z.string().trim().min(1).max(4),
  imageUrl: z.string().trim().max(1000).optional().nullable(),
  storagePath: z.string().trim().max(500).optional().nullable(),
  instagramUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  active: z.boolean().default(true)
})

export const updateTeamMemberSchema = createTeamMemberSchema.partial()

export const teamMemberSchema = createTeamMemberSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>
export type TeamMember = z.infer<typeof teamMemberSchema>
