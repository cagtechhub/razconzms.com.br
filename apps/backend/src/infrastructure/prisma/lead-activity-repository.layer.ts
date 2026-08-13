import { LeadActivityRepository } from '../../application/lead-activity-repository.context.js'
import { Effect, Layer } from 'effect'
import { makePrismaLeadActivityRepository } from './prisma-lead-activity-repository.adapter.js'
import { PrismaService } from './prisma.service.js'

export const LeadActivityRepositoryFromPrisma = Layer.effect(
  LeadActivityRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaLeadActivityRepository(prisma)
  })
)
