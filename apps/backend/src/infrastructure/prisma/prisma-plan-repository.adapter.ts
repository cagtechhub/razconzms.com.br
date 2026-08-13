import {
  planSchema,
  type CreatePlanInput,
  type Plan,
  type UpdatePlanInput
} from '@razconms/shared'
import type { PlanRepositoryPort } from '../../application/ports/plan-repository.port.js'
import { InfraError } from '../../domain/errors/infra-error.js'
import { Effect } from 'effect'
import type { PrismaClient } from './output/client.js'

type PlanRecord = {
  id: string
  name: string
  description: string
  features: string[]
  featured: boolean
  showPrice: boolean
  priceOriginalCents: number | null
  pricePromoCents: number | null
  sortOrder: number
  active: boolean
  ctaLabel: string | null
  createdAt: Date
  updatedAt: Date
}

const mapPlan = (record: PlanRecord): Plan =>
  planSchema.parse({
    id: record.id,
    name: record.name,
    description: record.description,
    features: record.features,
    featured: record.featured,
    showPrice: record.showPrice,
    priceOriginalCents: record.priceOriginalCents,
    pricePromoCents: record.pricePromoCents,
    sortOrder: record.sortOrder,
    active: record.active,
    ctaLabel: record.ctaLabel,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  })

export const makePrismaPlanRepository = (prisma: PrismaClient): PlanRepositoryPort => ({
  list: (options) =>
    Effect.tryPromise({
      try: () =>
        prisma.plan.findMany({
          where: options?.activeOnly ? { active: true } : undefined,
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
        }),
      catch: (cause) => new InfraError('Failed to list plans', cause)
    }).pipe(Effect.map((rows) => rows.map(mapPlan))),

  findById: (id) =>
    Effect.tryPromise({
      try: () => prisma.plan.findUnique({ where: { id } }),
      catch: (cause) => new InfraError('Failed to find plan', cause)
    }).pipe(Effect.map((row) => (row ? mapPlan(row) : null))),

  create: (input: CreatePlanInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.plan.create({
          data: {
            name: input.name,
            description: input.description,
            features: input.features,
            featured: input.featured ?? false,
            showPrice: input.showPrice ?? true,
            priceOriginalCents: input.priceOriginalCents ?? null,
            pricePromoCents: input.pricePromoCents ?? null,
            sortOrder: input.sortOrder ?? 0,
            active: input.active ?? true,
            ctaLabel: input.ctaLabel ?? null
          }
        }),
      catch: (cause) => new InfraError('Failed to create plan', cause)
    }).pipe(Effect.map(mapPlan)),

  update: (id, input: UpdatePlanInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.plan.update({
          where: { id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.description !== undefined
              ? { description: input.description }
              : {}),
            ...(input.features !== undefined ? { features: input.features } : {}),
            ...(input.featured !== undefined ? { featured: input.featured } : {}),
            ...(input.showPrice !== undefined ? { showPrice: input.showPrice } : {}),
            ...(input.priceOriginalCents !== undefined
              ? { priceOriginalCents: input.priceOriginalCents }
              : {}),
            ...(input.pricePromoCents !== undefined
              ? { pricePromoCents: input.pricePromoCents }
              : {}),
            ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
            ...(input.active !== undefined ? { active: input.active } : {}),
            ...(input.ctaLabel !== undefined ? { ctaLabel: input.ctaLabel } : {})
          }
        }),
      catch: (cause) => new InfraError('Failed to update plan', cause)
    }).pipe(Effect.map(mapPlan)),

  remove: (id) =>
    Effect.tryPromise({
      try: () => prisma.plan.delete({ where: { id } }),
      catch: (cause) => new InfraError('Failed to delete plan', cause)
    }).pipe(Effect.asVoid),

  clearFeatured: (exceptId) =>
    Effect.tryPromise({
      try: () =>
        prisma.plan.updateMany({
          where: exceptId
            ? { featured: true, id: { not: exceptId } }
            : { featured: true },
          data: { featured: false }
        }),
      catch: (cause) => new InfraError('Failed to clear featured plans', cause)
    }).pipe(Effect.asVoid)
})
