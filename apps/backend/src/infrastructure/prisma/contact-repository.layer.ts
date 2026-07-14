import { ContactRepository } from '../../application/contact-repository.context.js'
import { Effect, Layer } from 'effect'
import { makePrismaContactRepository } from './prisma-contact-repository.adapter.js'
import { PrismaService } from './prisma.service.js'

export const ContactRepositoryFromPrisma = Layer.effect(
  ContactRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaContactRepository(prisma)
  })
)
