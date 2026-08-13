import { describe, expect, it } from 'vitest'
import { createLeadSchema, updateLeadSchema } from './lead.js'

describe('createLeadSchema', () => {
  it('aceita payload válido com defaults', () => {
    const parsed = createLeadSchema.parse({
      fullName: 'Maria Silva',
      email: 'maria@exemplo.com'
    })

    expect(parsed.fullName).toBe('Maria Silva')
    expect(parsed.channel).toBe('WEBSITE')
    expect(parsed.status).toBe('NEW')
  })

  it('rejeita nome curto', () => {
    const result = createLeadSchema.safeParse({
      fullName: 'A'
    })

    expect(result.success).toBe(false)
  })
})

describe('updateLeadSchema', () => {
  it('aceita atualização parcial de status', () => {
    const parsed = updateLeadSchema.parse({ status: 'CONTACTED' })
    expect(parsed.status).toBe('CONTACTED')
  })
})
