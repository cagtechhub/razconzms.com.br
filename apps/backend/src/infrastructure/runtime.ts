import { Layer } from 'effect'
import type { ContactRepository } from '../application/contact-repository.context.js'
import type { DatabaseHealth } from '../application/database-health.context.js'
import type { LeadActivityRepository } from '../application/lead-activity-repository.context.js'
import type { LeadRepository } from '../application/lead-repository.context.js'
import type { PlanRepository } from '../application/plan-repository.context.js'
import type { SiteSettingsRepository } from '../application/site-settings-repository.context.js'
import type { TeamMemberRepository } from '../application/team-member-repository.context.js'
import { ContactRepositoryFromPrisma } from './prisma/contact-repository.layer.js'
import { DatabaseHealthFromPrisma } from './prisma/database-health.layer.js'
import { LeadActivityRepositoryFromPrisma } from './prisma/lead-activity-repository.layer.js'
import { LeadRepositoryFromPrisma } from './prisma/lead-repository.layer.js'
import { PlanRepositoryFromPrisma } from './prisma/plan-repository.layer.js'
import { PrismaLayer } from './prisma/prisma.service.js'
import { SiteSettingsRepositoryFromPrisma } from './prisma/site-settings-repository.layer.js'
import { TeamMemberRepositoryFromPrisma } from './prisma/team-member-repository.layer.js'

export type AppServices =
  | DatabaseHealth
  | ContactRepository
  | LeadRepository
  | LeadActivityRepository
  | SiteSettingsRepository
  | TeamMemberRepository
  | PlanRepository

export const AppRuntimeLayer: Layer.Layer<AppServices, never, never> = Layer.mergeAll(
  DatabaseHealthFromPrisma,
  ContactRepositoryFromPrisma,
  LeadRepositoryFromPrisma,
  LeadActivityRepositoryFromPrisma,
  SiteSettingsRepositoryFromPrisma,
  TeamMemberRepositoryFromPrisma,
  PlanRepositoryFromPrisma
).pipe(Layer.provide(PrismaLayer))
