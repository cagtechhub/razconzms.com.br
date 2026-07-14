import type { DatabaseHealthPort } from '../../application/ports/database-health.port.js'
import { InfraError } from '../../domain/errors/infra-error.js'
import { Effect } from 'effect'
import type { PrismaClient } from './output/client.js'

export const makePrismaDatabaseHealth = (prisma: PrismaClient): DatabaseHealthPort => ({
  ping: () =>
    Effect.tryPromise({
      try: () => prisma.$queryRaw`SELECT 1`,
      catch: (cause) => new InfraError('Database ping failed', cause)
    }).pipe(Effect.asVoid)
})
