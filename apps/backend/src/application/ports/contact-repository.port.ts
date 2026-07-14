import type { Contact, CreateContactInput } from '@razconms/shared'
import type { Effect } from 'effect'
import type { InfraError } from '../../domain/errors/infra-error.js'

export interface ContactRepositoryPort {
  readonly create: (
    input: CreateContactInput
  ) => Effect.Effect<Contact, InfraError, never>
}
