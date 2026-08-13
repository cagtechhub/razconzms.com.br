import { Context } from 'effect'
import type { LeadActivityRepositoryPort } from './ports/lead-activity-repository.port.js'

export class LeadActivityRepository extends Context.Tag(
  '@razconms/LeadActivityRepository'
)<LeadActivityRepository, LeadActivityRepositoryPort>() {}
