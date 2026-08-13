import { leadActivitySchema, type LeadActivity } from '@razconms/shared'
import type {
  CreateLeadActivityInput,
  LeadActivityRepositoryPort
} from '../../application/ports/lead-activity-repository.port.js'
import { InfraError } from '../../domain/errors/infra-error.js'
import { Effect } from 'effect'
import type { PrismaClient } from './output/client.js'

type ActivityRecord = {
  id: string
  leadId: string
  type: LeadActivity['type']
  message: string
  meta: unknown
  createdAt: Date
}

const mapActivity = (record: ActivityRecord): LeadActivity =>
  leadActivitySchema.parse({
    id: record.id,
    leadId: record.leadId,
    type: record.type,
    message: record.message,
    meta: record.meta ?? null,
    createdAt: record.createdAt
  })

export const makePrismaLeadActivityRepository = (
  prisma: PrismaClient
): LeadActivityRepositoryPort => ({
  listByLeadId: (leadId) =>
    Effect.tryPromise({
      try: () =>
        prisma.leadActivity.findMany({
          where: { leadId },
          orderBy: { createdAt: 'desc' }
        }),
      catch: (cause) => new InfraError('Failed to list lead activities', cause)
    }).pipe(Effect.map((rows) => rows.map(mapActivity))),

  append: (input: CreateLeadActivityInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.leadActivity.create({
          data: {
            leadId: input.leadId,
            type: input.type,
            message: input.message,
            meta: input.meta ?? undefined
          }
        }),
      catch: (cause) => new InfraError('Failed to append lead activity', cause)
    }).pipe(Effect.map(mapActivity))
})
