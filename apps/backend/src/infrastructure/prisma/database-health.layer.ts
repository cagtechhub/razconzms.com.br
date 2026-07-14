import { DatabaseHealth } from '../../application/database-health.context.js'
import { Effect, Layer } from 'effect'
import { makePrismaDatabaseHealth } from './prisma-database-health.adapter.js'
import { PrismaService } from './prisma.service.js'

export const DatabaseHealthFromPrisma = Layer.effect(
  DatabaseHealth,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaDatabaseHealth(prisma)
  })
)
