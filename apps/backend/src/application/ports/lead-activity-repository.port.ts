import type { LeadActivity, LeadActivityType } from '@razconms/shared'
import type { Effect } from 'effect'
import type { InfraError } from '../../domain/errors/infra-error.js'

export type CreateLeadActivityInput = {
  leadId: string
  type: LeadActivityType
  message: string
  meta?: unknown
}

export interface LeadActivityRepositoryPort {
  readonly listByLeadId: (
    leadId: string
  ) => Effect.Effect<LeadActivity[], InfraError, never>
  readonly append: (
    input: CreateLeadActivityInput
  ) => Effect.Effect<LeadActivity, InfraError, never>
}
