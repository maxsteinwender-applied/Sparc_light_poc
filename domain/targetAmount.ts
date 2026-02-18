import type { AmountFinderChip } from '../components/goalsData'

export const calculateTargetAmountFromFactors = (
  baseTargetAmount: number,
  chips: AmountFinderChip[],
  selectedFactors: string[],
): number => {
  const selectedLabels = new Set(selectedFactors)

  const adjustment = chips.reduce((sum, chip) => {
    return selectedLabels.has(chip.label) ? sum + chip.cost : sum
  }, 0)

  return baseTargetAmount + adjustment
}
