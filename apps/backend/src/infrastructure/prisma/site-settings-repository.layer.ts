import { SiteSettingsRepository } from '../../application/site-settings-repository.context.js'
import { Effect, Layer } from 'effect'
import { makePrismaSiteSettingsRepository } from './prisma-site-settings-repository.adapter.js'
import { PrismaService } from './prisma.service.js'

export const SiteSettingsRepositoryFromPrisma = Layer.effect(
  SiteSettingsRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaSiteSettingsRepository(prisma)
  })
)
