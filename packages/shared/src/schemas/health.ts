import { z } from 'zod'

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  api: z.literal('ok'),
  database: z.enum(['ok', 'error'])
})

export type HealthResponse = z.infer<typeof healthResponseSchema>
