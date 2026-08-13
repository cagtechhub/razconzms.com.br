import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import type { Lead } from '@razconms/shared'
import { LeadRepository } from '../lead-repository.context.js'
import { deleteLead, updateLead } from './lead.use-case.js'

const sampleLead: Lead = {
  id: 'lead-1',
  fullName: 'João Souza',
  email: 'joao@exemplo.com',
  phone: null,
  notes: null,
  channel: 'WEBSITE',
  status: 'NEW',
  contactId: null,
  createdAt: new Date('2026-08-12T12:00:00.000Z'),
  updatedAt: new Date('2026-08-12T12:00:00.000Z')
}

describe('updateLead', () => {
  it.effect('atualiza status quando o lead existe', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(LeadRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(sampleLead),
        create: () => Effect.die('unused'),
        update: (_id, input) =>
          Effect.succeed({
            ...sampleLead,
            status: input.status ?? sampleLead.status,
            updatedAt: new Date('2026-08-12T13:00:00.000Z')
          }),
        remove: () => Effect.void
      })

      const result = yield* updateLead('lead-1', { status: 'CONTACTED' }).pipe(
        Effect.provide(layer)
      )

      assert.strictEqual(result.status, 'CONTACTED')
    })
  )

  it.effect('falha quando o lead não existe', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(LeadRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(null),
        create: () => Effect.die('unused'),
        update: () => Effect.die('unused'),
        remove: () => Effect.void
      })

      const result = yield* updateLead('missing', { status: 'LOST' }).pipe(
        Effect.provide(layer),
        Effect.exit
      )

      assert.isTrue(result._tag === 'Failure')
    })
  )
})

describe('deleteLead', () => {
  it.effect('falha com InfraError quando o lead não existe', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(LeadRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(null),
        create: () => Effect.die('unused'),
        update: () => Effect.die('unused'),
        remove: () => Effect.void
      })

      const result = yield* deleteLead('missing').pipe(Effect.provide(layer), Effect.exit)

      assert.isTrue(result._tag === 'Failure')
    })
  )
})
