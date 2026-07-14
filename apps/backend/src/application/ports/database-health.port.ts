import type { Effect } from 'effect'

export interface DatabaseHealthPort {
  readonly ping: () => Effect.Effect<void, Error, never>
}
