import type {
  CreateLeadInput,
  Lead,
  ListLeadsQuery,
  UpdateLeadInput
} from '@razconms/shared'
import type { Effect } from 'effect'
import type { InfraError } from '../../domain/errors/infra-error.js'

export interface LeadRepositoryPort {
  readonly list: (query?: ListLeadsQuery) => Effect.Effect<Lead[], InfraError, never>
  readonly findById: (id: string) => Effect.Effect<Lead | null, InfraError, never>
  readonly create: (input: CreateLeadInput) => Effect.Effect<Lead, InfraError, never>
  readonly update: (
    id: string,
    input: UpdateLeadInput
  ) => Effect.Effect<Lead, InfraError, never>
  readonly remove: (id: string) => Effect.Effect<void, InfraError, never>
}
