import { Context } from 'effect'
import type { TeamMemberRepositoryPort } from './ports/team-member-repository.port.js'

export class TeamMemberRepository extends Context.Tag('@razconms/TeamMemberRepository')<
  TeamMemberRepository,
  TeamMemberRepositoryPort
>() {}
