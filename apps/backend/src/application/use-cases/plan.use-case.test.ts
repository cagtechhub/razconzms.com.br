import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import type { Plan } from '@razconms/shared'
import { PlanRepository } from '../plan-repository.context.js'
import { createPlan, listPlans, updatePlan } from './plan.use-case.js'

const gestao: Plan = {
  id: 'plan-1',
  name: 'Gestão',
  description: 'Acompanhamento para empresas em crescimento.',
  features: ['Folha', 'Relatórios'],
  featured: true,
  showPrice: true,
  priceOriginalCents: 79900,
  pricePromoCents: null,
  sortOrder: 1,
  active: true,
  ctaLabel: null,
  createdAt: new Date('2026-08-13T12:00:00.000Z'),
  updatedAt: new Date('2026-08-13T12:00:00.000Z')
}

describe('plan', () => {
  it.effect('lista apenas planos ativos', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(PlanRepository, {
        list: (options) => Effect.succeed(options?.activeOnly ? [gestao] : []),
        findById: () => Effect.succeed(gestao),
        create: () => Effect.die('unused'),
        update: () => Effect.die('unused'),
        remove: () => Effect.void,
        clearFeatured: () => Effect.void
      })

      const result = yield* listPlans({ activeOnly: true }).pipe(Effect.provide(layer))
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0]?.name, 'Gestão')
    })
  )

  it.effect('desmarca destaque ao criar plano featured', () =>
    Effect.gen(function* () {
      let cleared = false
      const layer = Layer.succeed(PlanRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(null),
        clearFeatured: () => {
          cleared = true
          return Effect.void
        },
        create: (input) =>
          Effect.succeed({
            ...gestao,
            id: 'plan-2',
            name: input.name,
            featured: input.featured ?? false,
            showPrice: input.showPrice ?? true
          }),
        update: () => Effect.die('unused'),
        remove: () => Effect.void
      })

      const result = yield* createPlan({
        name: 'Premium',
        description: 'Plano premium com consultoria.',
        features: ['Consultoria'],
        featured: true,
        showPrice: true,
        priceOriginalCents: 129900,
        sortOrder: 0,
        active: true
      }).pipe(Effect.provide(layer))

      assert.isTrue(cleared)
      assert.strictEqual(result.featured, true)
    })
  )

  it.effect('falha ao atualizar plano inexistente', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(PlanRepository, {
        list: () => Effect.succeed([]),
        findById: () => Effect.succeed(null),
        create: () => Effect.die('unused'),
        update: () => Effect.die('unused'),
        remove: () => Effect.void,
        clearFeatured: () => Effect.void
      })

      const result = yield* updatePlan('missing', { featured: true }).pipe(
        Effect.provide(layer),
        Effect.exit
      )

      assert.isTrue(result._tag === 'Failure')
    })
  )
})
