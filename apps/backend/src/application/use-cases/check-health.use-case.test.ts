import { Effect, Layer } from 'effect'
import { assert, describe, it } from '@effect/vitest'
import { DatabaseHealth } from '../database-health.context.js'
import { checkHealth } from './check-health.use-case.js'

describe('checkHealth', () => {
  it.effect('retorna api e database ok quando o ping sucede', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(DatabaseHealth, {
        ping: () => Effect.void
      })

      const result = yield* checkHealth.pipe(Effect.provide(layer))

      assert.deepStrictEqual(result, { api: 'ok', database: 'ok' })
    })
  )

  it.effect('propaga erro quando o ping falha', () =>
    Effect.gen(function* () {
      const layer = Layer.succeed(DatabaseHealth, {
        ping: () => Effect.fail(new Error('db down'))
      })

      const result = yield* checkHealth.pipe(Effect.provide(layer), Effect.exit)

      assert.isTrue(result._tag === 'Failure')
    })
  )
})
