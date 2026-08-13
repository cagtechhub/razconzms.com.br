import { Context } from 'effect'
import type { PlanRepositoryPort } from './ports/plan-repository.port.js'

export class PlanRepository extends Context.Tag('@razconms/PlanRepository')<
  PlanRepository,
  PlanRepositoryPort
>() {}
