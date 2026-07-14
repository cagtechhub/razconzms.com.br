import { describe, expect, it } from 'vitest'
import { createContactSchema } from './contact.js'

describe('createContactSchema', () => {
  it('aceita payload válido', () => {
    const parsed = createContactSchema.parse({
      fullName: 'Maria Silva',
      email: 'maria@exemplo.com',
      phone: '5511999999999',
      message: 'Olá'
    })

    expect(parsed.fullName).toBe('Maria Silva')
    expect(parsed.email).toBe('maria@exemplo.com')
  })

  it('rejeita e-mail inválido', () => {
    const result = createContactSchema.safeParse({
      fullName: 'Maria Silva',
      email: 'invalido'
    })

    expect(result.success).toBe(false)
  })

  it('rejeita nome curto', () => {
    const result = createContactSchema.safeParse({
      fullName: 'A',
      email: 'a@exemplo.com'
    })

    expect(result.success).toBe(false)
  })
})
