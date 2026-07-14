import { contactSchema, type Contact, type CreateContactInput } from '@razconms/shared'
import type { ContactRepositoryPort } from '../../application/ports/contact-repository.port.js'
import { InfraError } from '../../domain/errors/infra-error.js'
import { Effect } from 'effect'
import type { PrismaClient } from './output/client.js'

const mapContact = (record: {
  id: string
  fullName: string
  email: string
  phone: string | null
  message: string | null
  createdAt: Date
}): Contact =>
  contactSchema.parse({
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone ?? undefined,
    message: record.message ?? undefined,
    createdAt: record.createdAt
  })

export const makePrismaContactRepository = (
  prisma: PrismaClient
): ContactRepositoryPort => ({
  create: (input: CreateContactInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.contact.create({
          data: {
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            message: input.message
          }
        }),
      catch: (cause) => new InfraError('Failed to create contact', cause)
    }).pipe(Effect.map(mapContact))
})
