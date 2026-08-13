import type { CreateLeadInput, ListLeadsQuery, UpdateLeadInput } from '@razconms/shared'
import { Effect } from 'effect'
import { InfraError } from '../../domain/errors/infra-error.js'
import { LeadActivityRepository } from '../lead-activity-repository.context.js'
import { LeadRepository } from '../lead-repository.context.js'

export const listLeads = (query?: ListLeadsQuery) =>
  Effect.gen(function* () {
    const repo = yield* LeadRepository
    return yield* repo.list(query)
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

export const listLeadActivities = (leadId: string) =>
  Effect.gen(function* () {
    const leads = yield* LeadRepository
    const activities = yield* LeadActivityRepository
    const lead = yield* leads.findById(leadId)
    if (!lead) {
      return yield* Effect.fail(new InfraError('Lead not found'))
    }
    return yield* activities.listByLeadId(leadId)
  })

export const createLead = (input: CreateLeadInput) =>
  Effect.gen(function* () {
    const repo = yield* LeadRepository
    const activities = yield* LeadActivityRepository
    const lead = yield* repo.create(input)
    yield* activities.append({
      leadId: lead.id,
      type: 'CREATED',
      message: `Lead criado via ${lead.channel}`,
      meta: { channel: lead.channel, status: lead.status }
    })
    return lead
  })

export const updateLead = (id: string, input: UpdateLeadInput) =>
  Effect.gen(function* () {
    const repo = yield* LeadRepository
    const activities = yield* LeadActivityRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError('Lead not found'))
    }
    const updated = yield* repo.update(id, input)
    if (input.status !== undefined && input.status !== existing.status) {
      yield* activities.append({
        leadId: id,
        type: 'STATUS_CHANGED',
        message: `Status: ${existing.status} → ${updated.status}`,
        meta: { from: existing.status, to: updated.status }
      })
    }
    if (input.notes !== undefined && input.notes !== existing.notes) {
      yield* activities.append({
        leadId: id,
        type: 'NOTE_ADDED',
        message: updated.notes?.trim() ? updated.notes : 'Observações removidas',
        meta: { notes: updated.notes }
      })
    }
    return updated
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
