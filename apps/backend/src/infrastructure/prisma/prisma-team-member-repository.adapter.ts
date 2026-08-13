import {
  teamMemberSchema,
  type CreateTeamMemberInput,
  type TeamMember,
  type UpdateTeamMemberInput
} from '@razconms/shared'
import type { TeamMemberRepositoryPort } from '../../application/ports/team-member-repository.port.js'
import { InfraError } from '../../domain/errors/infra-error.js'
import { Effect } from 'effect'
import type { PrismaClient } from './output/client.js'

type TeamRecord = {
  id: string
  name: string
  role: string
  initials: string
  imageUrl: string | null
  storagePath: string | null
  instagramUrl: string | null
  linkedinUrl: string | null
  facebookUrl: string | null
  sortOrder: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const emptyToNull = (value: string | null | undefined) => {
  if (value === undefined) return undefined
  const trimmed = value?.trim() ?? ''
  return trimmed === '' ? null : trimmed
}

const mapMember = (record: TeamRecord): TeamMember =>
  teamMemberSchema.parse({
    id: record.id,
    name: record.name,
    role: record.role,
    initials: record.initials,
    imageUrl: record.imageUrl,
    storagePath: record.storagePath,
    instagramUrl: record.instagramUrl,
    linkedinUrl: record.linkedinUrl,
    facebookUrl: record.facebookUrl,
    sortOrder: record.sortOrder,
    active: record.active,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  })

export const makePrismaTeamMemberRepository = (
  prisma: PrismaClient
): TeamMemberRepositoryPort => ({
  list: (options) =>
    Effect.tryPromise({
      try: () =>
        prisma.teamMember.findMany({
          where: options?.activeOnly ? { active: true } : undefined,
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
        }),
      catch: (cause) => new InfraError('Failed to list team members', cause)
    }).pipe(Effect.map((rows) => rows.map(mapMember))),

  findById: (id) =>
    Effect.tryPromise({
      try: () => prisma.teamMember.findUnique({ where: { id } }),
      catch: (cause) => new InfraError('Failed to find team member', cause)
    }).pipe(Effect.map((row) => (row ? mapMember(row) : null))),

  create: (input: CreateTeamMemberInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.teamMember.create({
          data: {
            name: input.name,
            role: input.role,
            initials: input.initials,
            imageUrl: emptyToNull(input.imageUrl) ?? null,
            storagePath: emptyToNull(input.storagePath) ?? null,
            instagramUrl: emptyToNull(input.instagramUrl) ?? null,
            linkedinUrl: emptyToNull(input.linkedinUrl) ?? null,
            facebookUrl: emptyToNull(input.facebookUrl) ?? null,
            sortOrder: input.sortOrder ?? 0,
            active: input.active ?? true
          }
        }),
      catch: (cause) => new InfraError('Failed to create team member', cause)
    }).pipe(Effect.map(mapMember)),

  update: (id, input: UpdateTeamMemberInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.teamMember.update({
          where: { id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.role !== undefined ? { role: input.role } : {}),
            ...(input.initials !== undefined ? { initials: input.initials } : {}),
            ...(input.imageUrl !== undefined
              ? { imageUrl: emptyToNull(input.imageUrl) ?? null }
              : {}),
            ...(input.storagePath !== undefined
              ? { storagePath: emptyToNull(input.storagePath) ?? null }
              : {}),
            ...(input.instagramUrl !== undefined
              ? { instagramUrl: emptyToNull(input.instagramUrl) ?? null }
              : {}),
            ...(input.linkedinUrl !== undefined
              ? { linkedinUrl: emptyToNull(input.linkedinUrl) ?? null }
              : {}),
            ...(input.facebookUrl !== undefined
              ? { facebookUrl: emptyToNull(input.facebookUrl) ?? null }
              : {}),
            ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
            ...(input.active !== undefined ? { active: input.active } : {})
          }
        }),
      catch: (cause) => new InfraError('Failed to update team member', cause)
    }).pipe(Effect.map(mapMember)),

  remove: (id) =>
    Effect.tryPromise({
      try: () => prisma.teamMember.delete({ where: { id } }),
      catch: (cause) => new InfraError('Failed to delete team member', cause)
    }).pipe(Effect.asVoid)
})
