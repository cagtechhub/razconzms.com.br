import { PrismaPg } from '@prisma/adapter-pg'
import { Context, Effect, Layer } from 'effect'
import { PrismaClient } from './output/client.js'

export class PrismaService extends Context.Tag('@razconms/PrismaService')<
  PrismaService,
  PrismaClient
>() {}

export const PrismaLayer = Layer.scoped(
  PrismaService,
  Effect.acquireRelease(
    Effect.sync(() => {
      const connectionString = `${process.env.DATABASE_URL}`
      const adapter = new PrismaPg({ connectionString })
      return new PrismaClient({ adapter })
    }),
    ({ $disconnect }) => Effect.promise(() => $disconnect())
  )
)
