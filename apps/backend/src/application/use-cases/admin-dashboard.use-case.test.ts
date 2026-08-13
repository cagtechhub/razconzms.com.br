import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import type { Lead, TeamMember } from '@razconms/shared'
import { LeadRepository } from '../lead-repository.context.js'
import { TeamMemberRepository } from '../team-member-repository.context.js'
import { getAdminDashboardStats } from './admin-dashboard.use-case.js'

const lead = (status: Lead['status'], id: string): Lead => ({
  id,
  fullName: 'Lead',
  email: null,
  phone: null,
  notes: null,
  channel: 'WEBSITE',
  status,
  contactId: null,
  createdAt: new Date('2026-08-12T12:00:00.000Z'),
  updatedAt: new Date('2026-08-12T12:00:00.000Z')
})

const member = (active: boolean, id: string): TeamMember => ({
  id,
  name: 'Nome',
  role: 'Cargo',
  initials: 'NN',
  imageUrl: null,
  storagePath: null,
  instagramUrl: null,
  linkedinUrl: null,
  facebookUrl: null,
  sortOrder: 0,
  active,
  createdAt: new Date('2026-08-12T12:00:00.000Z'),
  updatedAt: new Date('2026-08-12T12:00:00.000Z')
})

describe('getAdminDashboardStats', () => {
  it.effect('agrega totais de leads e equipe', () =>
    Effect.gen(function* () {
      const layer = Layer.mergeAll(
        Layer.succeed(LeadRepository, {
          list: () =>
            Effect.succeed([lead('NEW', '1'), lead('CONTACTED', '2'), lead('NEW', '3')]),
          findById: () => Effect.succeed(null),
          create: () => Effect.die('unused'),
          update: () => Effect.die('unused'),
          remove: () => Effect.void
        }),
        Layer.succeed(TeamMemberRepository, {
          list: () =>
            Effect.succeed([member(true, 'a'), member(false, 'b'), member(true, 'c')]),
          findById: () => Effect.succeed(null),
          create: () => Effect.die('unused'),
          update: () => Effect.die('unused'),
          remove: () => Effect.void
        })
      )

      const result = yield* getAdminDashboardStats.pipe(Effect.provide(layer))

      assert.deepStrictEqual(result, {
        leadsNew: 2,
        leadsTotal: 3,
        teamActive: 2,
        teamTotal: 3
      })
    })
  )
})
