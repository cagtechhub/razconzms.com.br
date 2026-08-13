import {
  leadSchema,
  type CreateLeadInput,
  type Lead,
  type ListLeadsQuery,
  type UpdateLeadInput
} from '@razconms/shared'
import type { LeadRepositoryPort } from '../../application/ports/lead-repository.port.js'
import { InfraError } from '../../domain/errors/infra-error.js'
import { Effect } from 'effect'
import type { PrismaClient } from './output/client.js'

type LeadRecord = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  notes: string | null
  channel: CreateLeadInput['channel']
  status: NonNullable<CreateLeadInput['status']>
  contactId: string | null
  createdAt: Date
  updatedAt: Date
}

const mapLead = (record: LeadRecord): Lead =>
  leadSchema.parse({
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    notes: record.notes,
    channel: record.channel,
    status: record.status,
    contactId: record.contactId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  })

export const makePrismaLeadRepository = (prisma: PrismaClient): LeadRepositoryPort => ({
  list: (query?: ListLeadsQuery) =>
    Effect.tryPromise({
      try: () => {
        const q = query?.q?.trim()
        return prisma.lead.findMany({
          where: {
            ...(query?.status ? { status: query.status } : {}),
            ...(query?.channel ? { channel: query.channel } : {}),
            ...(q
              ? {
                  OR: [
                    { fullName: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                    { phone: { contains: q, mode: 'insensitive' } },
                    { notes: { contains: q, mode: 'insensitive' } }
                  ]
                }
              : {})
          },
          orderBy: { createdAt: 'desc' },
          ...(query?.limit ? { take: query.limit } : {})
        })
      },
      catch: (cause) => new InfraError('Failed to list leads', cause)
    }).pipe(Effect.map((rows) => rows.map(mapLead))),

  findById: (id) =>
    Effect.tryPromise({
      try: () => prisma.lead.findUnique({ where: { id } }),
      catch: (cause) => new InfraError('Failed to find lead', cause)
    }).pipe(Effect.map((row) => (row ? mapLead(row) : null))),

  create: (input: CreateLeadInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.lead.create({
          data: {
            fullName: input.fullName,
            email: input.email ?? null,
            phone: input.phone ?? null,
            notes: input.notes ?? null,
            channel: input.channel ?? 'WEBSITE',
            status: input.status ?? 'NEW',
            contactId: input.contactId ?? null
          }
        }),
      catch: (cause) => new InfraError('Failed to create lead', cause)
    }).pipe(Effect.map(mapLead)),

  update: (id, input: UpdateLeadInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.lead.update({
          where: { id },
          data: {
            ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
            ...(input.email !== undefined ? { email: input.email } : {}),
            ...(input.phone !== undefined ? { phone: input.phone } : {}),
            ...(input.notes !== undefined ? { notes: input.notes } : {}),
            ...(input.channel !== undefined ? { channel: input.channel } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
            ...(input.contactId !== undefined ? { contactId: input.contactId } : {})
          }
        }),
      catch: (cause) => new InfraError('Failed to update lead', cause)
    }).pipe(Effect.map(mapLead)),

  remove: (id) =>
    Effect.tryPromise({
      try: () => prisma.lead.delete({ where: { id } }),
      catch: (cause) => new InfraError('Failed to delete lead', cause)
    }).pipe(Effect.asVoid)
})
