import type {
  CreateTeamMemberInput,
  TeamMember,
  UpdateTeamMemberInput
} from '@razconms/shared'
import type { Effect } from 'effect'
import type { InfraError } from '../../domain/errors/infra-error.js'

export interface TeamMemberRepositoryPort {
  readonly list: (options?: {
    activeOnly?: boolean
  }) => Effect.Effect<TeamMember[], InfraError, never>
  readonly findById: (id: string) => Effect.Effect<TeamMember | null, InfraError, never>
  readonly create: (
    input: CreateTeamMemberInput
  ) => Effect.Effect<TeamMember, InfraError, never>
  readonly update: (
    id: string,
    input: UpdateTeamMemberInput
  ) => Effect.Effect<TeamMember, InfraError, never>
  readonly remove: (id: string) => Effect.Effect<void, InfraError, never>
}
