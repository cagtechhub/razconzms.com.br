import type { CreateLeadInput, UpdateLeadInput } from '@razconms/shared'
import { Effect } from 'effect'
import { InfraError } from '../../domain/errors/infra-error.js'
import { LeadRepository } from '../lead-repository.context.js'

export const listLeads = Effect.gen(function* () {
  const repo = yield* LeadRepository
  return yield* repo.list()
})

export const getLeadById = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* LeadRepository
    const lead = yield* repo.findById(id)
    if (!lead) {
      return yield* Effect.fail(new InfraError('Lead not found'))
    }
    return lead
  })

export const createLead = (input: CreateLeadInput) =>
  Effect.gen(function* () {
    const repo = yield* LeadRepository
    return yield* repo.create(input)
  })

export const updateLead = (id: string, input: UpdateLeadInput) =>
  Effect.gen(function* () {
    const repo = yield* LeadRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError('Lead not found'))
    }
    return yield* repo.update(id, input)
  })

export const deleteLead = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* LeadRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError('Lead not found'))
    }
    yield* repo.remove(id)
  })
