import { Effect } from 'effect'
import { LeadRepository } from '../lead-repository.context.js'
import { TeamMemberRepository } from '../team-member-repository.context.js'

export const getAdminDashboardStats = Effect.gen(function* () {
  const leads = yield* LeadRepository
  const team = yield* TeamMemberRepository
  const allLeads = yield* leads.list()
  const allTeam = yield* team.list()

  return {
    leadsNew: allLeads.filter((lead) => lead.status === 'NEW').length,
    leadsTotal: allLeads.length,
    teamActive: allTeam.filter((member) => member.active).length,
    teamTotal: allTeam.length
  }
})
