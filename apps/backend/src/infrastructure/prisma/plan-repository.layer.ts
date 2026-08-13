import { PlanRepository } from '../../application/plan-repository.context.js'
import { Effect, Layer } from 'effect'
import { makePrismaPlanRepository } from './prisma-plan-repository.adapter.js'
import { PrismaService } from './prisma.service.js'

export const PlanRepositoryFromPrisma = Layer.effect(
  PlanRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaPlanRepository(prisma)
  })
)
