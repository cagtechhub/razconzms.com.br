import type { CreateContactInput } from '@razconms/shared'
import { Effect } from 'effect'
import { ContactRepository } from '../contact-repository.context.js'
import { createLead } from './lead.use-case.js'

export const createContact = (input: CreateContactInput) =>
  Effect.gen(function* () {
    const contacts = yield* ContactRepository
    const contact = yield* contacts.create(input)
    yield* createLead({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone ?? null,
      notes: input.message?.trim() ? input.message : null,
      channel: 'WEBSITE',
      status: 'NEW',
      contactId: contact.id
    })
    return contact
  })
