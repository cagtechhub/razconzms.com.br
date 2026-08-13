import type { CreatePlanInput, UpdatePlanInput } from '@razconms/shared'
import { Effect } from 'effect'
import { InfraError } from '../../domain/errors/infra-error.js'
import { PlanRepository } from '../plan-repository.context.js'

export const listPlans = (options?: { activeOnly?: boolean }) =>
  Effect.gen(function* () {
    const repo = yield* PlanRepository
    return yield* repo.list(options)
  })

export const getPlanById = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* PlanRepository
    const plan = yield* repo.findById(id)
    if (!plan) {
      return yield* Effect.fail(new InfraError('Plan not found'))
    }
    return plan
  })

export const createPlan = (input: CreatePlanInput) =>
  Effect.gen(function* () {
    const repo = yield* PlanRepository
    if (input.featured) {
      yield* repo.clearFeatured()
    }
    return yield* repo.create(input)
  })

export const updatePlan = (id: string, input: UpdatePlanInput) =>
  Effect.gen(function* () {
    const repo = yield* PlanRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError('Plan not found'))
    }
    if (input.featured === true) {
      yield* repo.clearFeatured(id)
    }
    return yield* repo.update(id, input)
  })

export const deletePlan = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* PlanRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError('Plan not found'))
    }
    yield* repo.remove(id)
  })
