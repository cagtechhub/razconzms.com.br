import type { CreateContactInput } from '@razconms/shared'
import { Effect } from 'effect'
import { ContactRepository } from '../contact-repository.context.js'
import { LeadRepository } from '../lead-repository.context.js'

export const createContact = (input: CreateContactInput) =>
  Effect.gen(function* () {
    const contacts = yield* ContactRepository
    const leads = yield* LeadRepository
    const contact = yield* contacts.create(input)
    yield* leads.create({
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
