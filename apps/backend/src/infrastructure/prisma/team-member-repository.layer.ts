import { TeamMemberRepository } from '../../application/team-member-repository.context.js'
import { Effect, Layer } from 'effect'
import { makePrismaTeamMemberRepository } from './prisma-team-member-repository.adapter.js'
import { PrismaService } from './prisma.service.js'

export const TeamMemberRepositoryFromPrisma = Layer.effect(
  TeamMemberRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaTeamMemberRepository(prisma)
  })
)
