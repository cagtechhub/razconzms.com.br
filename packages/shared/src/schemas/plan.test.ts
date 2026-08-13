import { describe, expect, it } from 'vitest'
import { createPlanSchema } from './plan.js'

describe('createPlanSchema', () => {
  it('aceita plano com preço em centavos', () => {
    const parsed = createPlanSchema.parse({
      name: 'Gestão',
      description: 'Acompanhamento para empresas em crescimento.',
      features: ['Folha', 'Relatórios'],
      featured: true,
      showPrice: true,
      priceOriginalCents: 79900,
      pricePromoCents: 69900
    })

    expect(parsed.priceOriginalCents).toBe(79900)
    expect(parsed.featured).toBe(true)
  })

  it('rejeita preço decimal', () => {
    const result = createPlanSchema.safeParse({
      name: 'Gestão',
      description: 'Acompanhamento para empresas em crescimento.',
      features: ['Folha'],
      priceOriginalCents: 799.9
    })

    expect(result.success).toBe(false)
  })
})
