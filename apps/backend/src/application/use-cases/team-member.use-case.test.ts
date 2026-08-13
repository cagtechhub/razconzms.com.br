import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import type { TeamMember } from '@razconms/shared'
import { TeamMemberRepository } from '../team-member-repository.context.js'
import {
  createTeamMember,
  listTeamMembers,
  updateTeamMember
} from './team-member.use-case.js'

const rita: TeamMember = {
  id: 'team-1',
  name: 'Rita',
  role: 'Diretora',
  initials: 'RT',
  imageUrl: '/img/team/rita.jpeg',
  storagePath: null,
  instagramUrl: null,
  linkedinUrl: null,
  facebookUrl: null,
  sortOrder: 0,
  active: true,
  createdAt: new Date('2026-08-12T12:00:00.000Z'),
  updatedAt: new Date('2026-08-12T12:00:00.000Z')
}

describe('teamMember', () => {
  it.effect('lista membros ativos', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(TeamMemberRepository, {
        list: () => Effect.succeed([rita]),
        findById: () => Effect.succeed(rita),
        create: () => Effect.die('unused'),
        update: () => Effect.die('unused'),
        remove: () => Effect.void
      })

      const result = yield* listTeamMembers({ activeOnly: true }).pipe(
        Effect.provide(layer)
      )
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0]?.name, 'Rita')
    })
  )

  it.effect('cria membro', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(TeamMemberRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(null),
        create: (input) =>
          Effect.succeed({
            ...rita,
            id: 'team-2',
            name: input.name,
            role: input.role,
            initials: input.initials
          }),
        update: () => Effect.die('unused'),
        remove: () => Effect.void
      })

      const result = yield* createTeamMember({
        name: 'Tiago',
        role: 'Especialista contábil',
        initials: 'TA',
        sortOrder: 0,
        active: true
      }).pipe(Effect.provide(layer))

      assert.strictEqual(result.name, 'Tiago')
    })
  )

  it.effect('falha ao atualizar membro inexistente', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(TeamMemberRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(null),
        create: () => Effect.die('unused'),
        update: () => Effect.die('unused'),
        remove: () => Effect.void
      })

      const result = yield* updateTeamMember('missing', { active: false }).pipe(
        Effect.provide(layer),
        Effect.exit
      )

      assert.isTrue(result._tag === 'Failure')
    })
  )
})
