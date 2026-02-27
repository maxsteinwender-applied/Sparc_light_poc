import { describe, expect, it } from 'vitest'
import { buildResultDeepLink, parseResultDeepLink } from '../../domain/resultDeepLink'

describe('resultDeepLink', () => {
  it('builds canonical deep links with interest and parses them', () => {
    const url = buildResultDeepLink('https://example.test/', {
      goal: 'travel',
      target: 12_500,
      years: 8,
      strategy: 'balanced',
      rate: 0.056,
    })

    const params = Object.fromEntries(new URL(url).searchParams.entries())
    const parsed = parseResultDeepLink(params)

    expect(params).toMatchObject({
      goal: 'travel',
      target: '12500',
      years: '8',
      interest: 'variant2',
    })
    expect(params.strategy).toBeUndefined()

    expect(parsed).toEqual({
      goal: 'travel',
      target: 12_500,
      years: 8,
      strategy: 'balanced',
    })
  })

  it('includes and parses custom rate for custom interest', () => {
    const url = buildResultDeepLink('https://example.test/', {
      goal: 'custom',
      target: 22_000,
      years: 10,
      strategy: 'custom',
      rate: 0.071,
    })

    const parsed = parseResultDeepLink(
      Object.fromEntries(new URL(url).searchParams.entries()),
    )

    expect(parsed).toEqual({
      goal: 'custom',
      target: 22_000,
      years: 10,
      strategy: 'custom',
      rate: 0.071,
    })
  })

  it('parses legacy strategy links during migration', () => {
    const parsed = parseResultDeepLink({
      goal: 'travel',
      target: '10000',
      years: '6',
      strategy: 'growth',
    })

    expect(parsed).toEqual({
      goal: 'travel',
      target: 10_000,
      years: 6,
      strategy: 'growth',
    })
  })

  it('rejects custom links without rate', () => {
    const parsed = parseResultDeepLink({
      goal: 'travel',
      target: '10000',
      years: '6',
      interest: 'custom',
    })

    expect(parsed).toBeNull()
  })

  it('rejects custom links with invalid rate', () => {
    const aboveMax = parseResultDeepLink({
      goal: 'travel',
      target: '10000',
      years: '6',
      interest: 'custom',
      rate: '0.2',
    })

    const belowMin = parseResultDeepLink({
      goal: 'travel',
      target: '10000',
      years: '6',
      interest: 'custom',
      rate: '-0.01',
    })

    expect(aboveMax).toBeNull()
    expect(belowMin).toBeNull()
  })

  it('rejects years above max and non-positive years', () => {
    const overMax = parseResultDeepLink({
      goal: 'travel',
      target: '10000',
      years: '41',
      interest: 'variant2',
    })

    const nonPositive = parseResultDeepLink({
      goal: 'travel',
      target: '10000',
      years: '0',
      interest: 'variant2',
    })

    expect(overMax).toBeNull()
    expect(nonPositive).toBeNull()
  })

  it('rejects invalid numeric and interest input', () => {
    const parsed = parseResultDeepLink({
      goal: 'travel',
      target: '0',
      years: '6',
      interest: 'invalid',
    })

    expect(parsed).toBeNull()
  })
})
