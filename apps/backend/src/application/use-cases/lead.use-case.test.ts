import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import type { Lead, LeadActivity } from '@razconms/shared'
import { LeadActivityRepository } from '../lead-activity-repository.context.js'
import { LeadRepository } from '../lead-repository.context.js'
import { createLead, deleteLead, listLeads, updateLead } from './lead.use-case.js'

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

const activity = (overrides?: Partial<LeadActivity>): LeadActivity => ({
  id: 'act-1',
  leadId: 'lead-1',
  type: 'CREATED',
  message: 'Lead criado via WEBSITE',
  meta: { channel: 'WEBSITE' },
  createdAt: new Date('2026-08-12T12:00:00.000Z'),
  ...overrides
})

const unusedLeadRepo = {
  list: () => Effect.succeed([] as Lead[]),
  findById: () => Effect.succeed(null),
  create: () => Effect.die('unused') as never,
  update: () => Effect.die('unused') as never,
  remove: () => Effect.void
}

const unusedActivityRepo = {
  listByLeadId: () => Effect.succeed([] as LeadActivity[]),
  append: () => Effect.die('unused') as never
}

describe('listLeads', () => {
  it.effect('encaminha filtros para o repositório', () =>
    Effect.gen(function* () {
      const layer = Layer.mergeAll(
        Layer.succeed(LeadRepository, {
          ...unusedLeadRepo,
          list: (query) =>
            Effect.succeed(
              query?.status === 'NEW' && query.channel === 'WHATSAPP' ? [sampleLead] : []
            )
        }),
        Layer.succeed(LeadActivityRepository, unusedActivityRepo)
      )

      const result = yield* listLeads({
        status: 'NEW',
        channel: 'WHATSAPP',
        limit: 50
      }).pipe(Effect.provide(layer))

      assert.strictEqual(result.length, 1)
    })
  )
})

describe('createLead', () => {
  it.effect('cria lead e registra atividade CREATED', () =>
    Effect.gen(function* () {
      const created: LeadActivity[] = []
      const layer = Layer.mergeAll(
        Layer.succeed(LeadRepository, {
          ...unusedLeadRepo,
          create: (input) =>
            Effect.succeed({
              ...sampleLead,
              fullName: input.fullName,
              channel: input.channel ?? 'WEBSITE',
              status: input.status ?? 'NEW'
            })
        }),
        Layer.succeed(LeadActivityRepository, {
          listByLeadId: () => Effect.succeed([]),
          append: (input) => {
            const item = activity({
              type: input.type,
              message: input.message,
              meta: input.meta
            })
            created.push(item)
            return Effect.succeed(item)
          }
        })
      )

      const result = yield* createLead({
        fullName: 'João Souza',
        email: 'joao@exemplo.com',
        channel: 'WEBSITE',
        status: 'NEW'
      }).pipe(Effect.provide(layer))

      assert.strictEqual(result.fullName, 'João Souza')
      assert.strictEqual(created[0]?.type, 'CREATED')
    })
  )
})

describe('updateLead', () => {
  it.effect('atualiza status e registra STATUS_CHANGED', () =>
    Effect.gen(function* () {
      const created: LeadActivity[] = []
      const layer = Layer.mergeAll(
        Layer.succeed(LeadRepository, {
          ...unusedLeadRepo,
          findById: () => Effect.succeed(sampleLead),
          update: (_id, input) =>
            Effect.succeed({
              ...sampleLead,
              status: input.status ?? sampleLead.status,
              notes: input.notes === undefined ? sampleLead.notes : input.notes,
              updatedAt: new Date('2026-08-12T13:00:00.000Z')
            })
        }),
        Layer.succeed(LeadActivityRepository, {
          listByLeadId: () => Effect.succeed([]),
          append: (input) => {
            const item = activity({
              type: input.type,
              message: input.message,
              meta: input.meta
            })
            created.push(item)
            return Effect.succeed(item)
          }
        })
      )

      const result = yield* updateLead('lead-1', { status: 'CONTACTED' }).pipe(
        Effect.provide(layer)
      )

      assert.strictEqual(result.status, 'CONTACTED')
      assert.strictEqual(created[0]?.type, 'STATUS_CHANGED')
    })
  )

  it.effect('falha quando o lead não existe', () =>
    Effect.gen(function* () {
      const layer = Layer.mergeAll(
        Layer.succeed(LeadRepository, unusedLeadRepo),
        Layer.succeed(LeadActivityRepository, unusedActivityRepo)
      )

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
      const layer = Layer.mergeAll(
        Layer.succeed(LeadRepository, unusedLeadRepo),
        Layer.succeed(LeadActivityRepository, unusedActivityRepo)
      )

      const result = yield* deleteLead('missing').pipe(Effect.provide(layer), Effect.exit)

      assert.isTrue(result._tag === 'Failure')
    })
  )
})
