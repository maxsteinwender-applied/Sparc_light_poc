import { describe, expect, it } from 'vitest'
import {
  calculateSavingsPlan,
  calculateTimeGainWithExtraMonthly,
} from '../../domain/savingsPlan'

describe('calculateSavingsPlan', () => {
it('0% Rendite ergibt lineare Sparrate', () => {
  const result = calculateSavingsPlan({
    targetAmount: 12_000,
    durationYears: 1,
    annualRate: 0,
    currentYear: 2026,
  })

  expect(result.monthlySavings).toBe(1_000)
  expect(result.zeroReturnMonthly).toBe(1_000)
  expect(result.monthlyDifference).toBe(0)
  expect(result.totalInvested).toBe(12_000)
  expect(result.totalReturn).toBe(0)
  expect(result.targetYear).toBe(2027)
  expect(result.chartData.length).toBe(2)
  expect(result.chartData.at(-1)?.value).toBe(12_000)
})

it('positive Rendite reduziert die Monatsrate vs. 0%', () => {
  const result = calculateSavingsPlan({
    targetAmount: 10_000,
    durationYears: 2,
    annualRate: 0.06,
    currentYear: 2026,
  })

  expect(result.monthlySavings).toBeGreaterThan(0)
  expect(result.monthlySavings).toBeLessThan(result.zeroReturnMonthly)
  expect(result.totalReturn).toBeGreaterThan(0)
  expect(result.targetYear).toBe(2028)
})

it('showZeroReturn erweitert Chart-Horizont bei Bedarf', () => {
  const withZeroReturn = calculateSavingsPlan({
    targetAmount: 10_000,
    durationYears: 1,
    annualRate: 0.08,
    showZeroReturn: true,
    currentYear: 2026,
  })
  const withoutZeroReturn = calculateSavingsPlan({
    targetAmount: 10_000,
    durationYears: 1,
    annualRate: 0.08,
    showZeroReturn: false,
    currentYear: 2026,
  })

  expect(withZeroReturn.chartData.length).toBeGreaterThanOrEqual(withoutZeroReturn.chartData.length)
  expect(withZeroReturn.yearsNeededZero).toBeGreaterThanOrEqual(1)
})

it('zusätzliche monatliche Sparrate bringt Zeitgewinn bei 0% Rendite', () => {
  const result = calculateTimeGainWithExtraMonthly({
    targetAmount: 12_100,
    baseMonthlySavings: 1_000,
    extraMonthlySavings: 20,
    annualRate: 0,
  })

  expect(result).not.toBeNull()
  expect(result?.optimizedMonths).toBeLessThan(result?.baseMonths ?? 0)
  expect(result?.monthsEarlier).toBeGreaterThan(0)
})

it('zusätzliche monatliche Sparrate bringt Zeitgewinn bei positiver Rendite', () => {
  const result = calculateTimeGainWithExtraMonthly({
    targetAmount: 30_000,
    baseMonthlySavings: 450,
    extraMonthlySavings: 20,
    annualRate: 0.06,
  })

  expect(result).not.toBeNull()
  expect(result?.optimizedMonths).toBeLessThan(result?.baseMonths ?? 0)
  expect(result?.monthsEarlier).toBeGreaterThan(0)
})

it('liefert null bei ungültiger Basisrate', () => {
  const result = calculateTimeGainWithExtraMonthly({
    targetAmount: 12_000,
    baseMonthlySavings: 0,
    extraMonthlySavings: 20,
    annualRate: 0.05,
  })

  expect(result).toBeNull()
})
})
