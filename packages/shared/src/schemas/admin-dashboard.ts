import { z } from 'zod'

export const adminDashboardStatsSchema = z.object({
  leadsNew: z.number().int().nonnegative(),
  leadsTotal: z.number().int().nonnegative(),
  teamActive: z.number().int().nonnegative(),
  teamTotal: z.number().int().nonnegative()
})

export type AdminDashboardStats = z.infer<typeof adminDashboardStatsSchema>
