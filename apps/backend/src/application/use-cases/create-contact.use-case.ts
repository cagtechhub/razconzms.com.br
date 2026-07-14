import type { CreateContactInput } from '@razconms/shared'
import { Effect } from 'effect'
import { ContactRepository } from '../contact-repository.context.js'

export const createContact = (input: CreateContactInput) =>
  Effect.gen(function* () {
    const repository = yield* ContactRepository
    return yield* repository.create(input)
  })
