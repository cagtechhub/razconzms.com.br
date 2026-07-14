import { Effect } from 'effect'
import { DatabaseHealth } from '../database-health.context.js'

export const checkHealth = Effect.gen(function* () {
  const db = yield* DatabaseHealth
  yield* db.ping()
  return { api: 'ok' as const, database: 'ok' as const }
})
