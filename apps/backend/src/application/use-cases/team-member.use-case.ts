import type { CreateTeamMemberInput, UpdateTeamMemberInput } from '@razconms/shared'
import { Effect } from 'effect'
import { InfraError } from '../../domain/errors/infra-error.js'
import { TeamMemberRepository } from '../team-member-repository.context.js'

export const listTeamMembers = (options?: { activeOnly?: boolean }) =>
  Effect.gen(function* () {
    const repo = yield* TeamMemberRepository
    return yield* repo.list(options)
  })

export const getTeamMemberById = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* TeamMemberRepository
    const member = yield* repo.findById(id)
    if (!member) {
      return yield* Effect.fail(new InfraError('Team member not found'))
    }
    return member
  })

export const createTeamMember = (input: CreateTeamMemberInput) =>
  Effect.gen(function* () {
    const repo = yield* TeamMemberRepository
    return yield* repo.create(input)
  })

export const updateTeamMember = (id: string, input: UpdateTeamMemberInput) =>
  Effect.gen(function* () {
    const repo = yield* TeamMemberRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError('Team member not found'))
    }
    return yield* repo.update(id, input)
  })

export const deleteTeamMember = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* TeamMemberRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError('Team member not found'))
    }
    yield* repo.remove(id)
  })
