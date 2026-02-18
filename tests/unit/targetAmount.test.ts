import { describe, expect, it } from 'vitest'
import { calculateTargetAmountFromFactors } from '../../domain/targetAmount'

describe('calculateTargetAmountFromFactors', () => {
it('addiert nur selektierte Faktoren', () => {
  const baseTargetAmount = 6_000
  const chips = [
    { label: 'Viele Fluege', emoji: 'x', cost: 800 },
    { label: 'Komfort-Unterkuenfte', emoji: 'x', cost: 1_200 },
    { label: 'Einfache Unterkuenfte', emoji: 'x', cost: -800 },
  ]

  const selectedFactors = ['Viele Fluege', 'Einfache Unterkuenfte']
  const result = calculateTargetAmountFromFactors(baseTargetAmount, chips, selectedFactors)

  expect(result).toBe(6_000)
})

it('ignoriert unbekannte Faktoren', () => {
  const baseTargetAmount = 10_000
  const chips = [{ label: 'Ruecklagen', emoji: 'x', cost: 500 }]

  const result = calculateTargetAmountFromFactors(baseTargetAmount, chips, ['Nicht vorhanden'])

  expect(result).toBe(10_000)
})
})
