import { Layer } from 'effect'
import type { ContactRepository } from '../application/contact-repository.context.js'
import type { DatabaseHealth } from '../application/database-health.context.js'
import { ContactRepositoryFromPrisma } from './prisma/contact-repository.layer.js'
import { DatabaseHealthFromPrisma } from './prisma/database-health.layer.js'
import { PrismaLayer } from './prisma/prisma.service.js'

export type AppServices = DatabaseHealth | ContactRepository

export const AppRuntimeLayer: Layer.Layer<AppServices, never, never> = Layer.mergeAll(
  DatabaseHealthFromPrisma,
  ContactRepositoryFromPrisma
).pipe(Layer.provide(PrismaLayer))
