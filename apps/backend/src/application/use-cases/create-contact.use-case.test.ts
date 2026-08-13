import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import type { LeadActivity } from '@razconms/shared'
import { ContactRepository } from '../contact-repository.context.js'
import { LeadActivityRepository } from '../lead-activity-repository.context.js'
import { LeadRepository } from '../lead-repository.context.js'
import { createContact } from './create-contact.use-case.js'

describe('createContact', () => {
  it.effect('cria contato e lead com canal WEBSITE', () =>
    Effect.gen(function* () {
      const createdLeads: Array<Record<string, unknown>> = []

      const contactsLayer = Layer.succeed(ContactRepository, {
        create: (input) =>
          Effect.succeed({
            id: 'contact-1',
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            message: input.message,
            createdAt: new Date('2026-08-12T12:00:00.000Z')
          })
      })

      const leadsLayer = Layer.succeed(LeadRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(null),
        create: (input) => {
          createdLeads.push(input)
          return Effect.succeed({
            id: 'lead-1',
            fullName: input.fullName,
            email: input.email ?? null,
            phone: input.phone ?? null,
            notes: input.notes ?? null,
            channel: input.channel ?? 'WEBSITE',
            status: input.status ?? 'NEW',
            contactId: input.contactId ?? null,
            createdAt: new Date('2026-08-12T12:00:00.000Z'),
            updatedAt: new Date('2026-08-12T12:00:00.000Z')
          })
        },
        update: () => Effect.die('unused'),
        remove: () => Effect.void
      })

      const activitiesLayer = Layer.succeed(LeadActivityRepository, {
        listByLeadId: () => Effect.succeed([]),
        append: (input) =>
          Effect.succeed({
            id: 'act-1',
            leadId: input.leadId,
            type: input.type,
            message: input.message,
            meta: input.meta ?? null,
            createdAt: new Date('2026-08-12T12:00:00.000Z')
          } satisfies LeadActivity)
      })

      const result = yield* createContact({
        fullName: 'Maria Silva',
        email: 'maria@exemplo.com',
        phone: '5511999999999',
        message: 'Quero um plano'
      }).pipe(Effect.provide(Layer.mergeAll(contactsLayer, leadsLayer, activitiesLayer)))

      assert.strictEqual(result.id, 'contact-1')
      assert.strictEqual(createdLeads.length, 1)
      assert.deepStrictEqual(createdLeads[0], {
        fullName: 'Maria Silva',
        email: 'maria@exemplo.com',
        phone: '5511999999999',
        notes: 'Quero um plano',
        channel: 'WEBSITE',
        status: 'NEW',
        contactId: 'contact-1'
      })
    })
  )
})
