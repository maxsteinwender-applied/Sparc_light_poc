import { describe, expect, it } from 'vitest'
import {
  clampDurationYears,
  clampTargetAmount,
  normalizeCustomGoalName,
  parseEuroInput,
} from '../../domain/wizardValidation'

describe('wizardValidation', () => {
it('parseEuroInput extrahiert nur numerische Zeichen', () => {
  expect(parseEuroInput('12.345 EUR')).toBe(12_345)
  expect(parseEuroInput('abc')).toBeNull()
  expect(parseEuroInput('0')).toBeNull()
})

it('clampDurationYears klemmt auf [1..40] und rundet', () => {
  expect(clampDurationYears(Number.NaN)).toBe(1)
  expect(clampDurationYears(0)).toBe(1)
  expect(clampDurationYears(2.4)).toBe(2)
  expect(clampDurationYears(40.7)).toBe(40)
})

it('clampTargetAmount erzwingt Mindestwert 1', () => {
  expect(clampTargetAmount(Number.NaN)).toBe(1)
  expect(clampTargetAmount(-10)).toBe(1)
  expect(clampTargetAmount(1000.6)).toBe(1001)
})

it('normalizeCustomGoalName trimmt und normalisiert Mehrfach-Leerzeichen', () => {
  expect(normalizeCustomGoalName('  Mein    Ziel   2026  ')).toBe('Mein Ziel 2026')
})
})
