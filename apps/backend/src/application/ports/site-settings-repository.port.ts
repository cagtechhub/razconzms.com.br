import type { SiteSettings, UpdateSiteSettingsInput } from '@razconms/shared'
import type { Effect } from 'effect'
import type { InfraError } from '../../domain/errors/infra-error.js'

export interface SiteSettingsRepositoryPort {
  readonly get: () => Effect.Effect<SiteSettings, InfraError, never>
  readonly update: (
    input: UpdateSiteSettingsInput
  ) => Effect.Effect<SiteSettings, InfraError, never>
}
