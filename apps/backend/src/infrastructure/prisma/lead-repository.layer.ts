import { LeadRepository } from '../../application/lead-repository.context.js'
import { Effect, Layer } from 'effect'
import { makePrismaLeadRepository } from './prisma-lead-repository.adapter.js'
import { PrismaService } from './prisma.service.js'

export const LeadRepositoryFromPrisma = Layer.effect(
  LeadRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaLeadRepository(prisma)
  })
)
