export function centsToBrl(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

export function reaisInputToCents(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return null
  const normalized =
    typeof value === 'number'
      ? String(value)
      : value.trim().replace(/\./g, '').replace(',', '.')
  if (!normalized) return null
  const amount = Number(normalized)
  if (!Number.isFinite(amount) || amount < 0) return null
  return Math.round(amount * 100)
}

export function centsToReaisInput(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return ''
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
