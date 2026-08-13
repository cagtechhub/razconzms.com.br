import type { CreatePlanInput, Plan, UpdatePlanInput } from '@razconms/shared'
import type { Effect } from 'effect'
import type { InfraError } from '../../domain/errors/infra-error.js'

export interface PlanRepositoryPort {
  readonly list: (options?: {
    activeOnly?: boolean
  }) => Effect.Effect<Plan[], InfraError, never>
  readonly findById: (id: string) => Effect.Effect<Plan | null, InfraError, never>
  readonly create: (input: CreatePlanInput) => Effect.Effect<Plan, InfraError, never>
  readonly update: (
    id: string,
    input: UpdatePlanInput
  ) => Effect.Effect<Plan, InfraError, never>
  readonly remove: (id: string) => Effect.Effect<void, InfraError, never>
  readonly clearFeatured: (exceptId?: string) => Effect.Effect<void, InfraError, never>
}
