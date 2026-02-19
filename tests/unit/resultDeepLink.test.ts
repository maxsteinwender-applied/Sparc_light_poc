import { describe, expect, it } from 'vitest'
import { buildResultDeepLink, parseResultDeepLink } from '../../domain/resultDeepLink'

describe('resultDeepLink', () => {
  it('builds and parses deep links for standard strategies', () => {
    const url = buildResultDeepLink('https://example.test/', {
      goal: 'travel',
      target: 12_500,
      years: 8,
      strategy: 'balanced',
      rate: 0.056,
    })

    const parsed = parseResultDeepLink(
      Object.fromEntries(new URL(url).searchParams.entries()),
    )

    expect(parsed).toEqual({
      goal: 'travel',
      target: 12_500,
      years: 8,
      strategy: 'balanced',
    })
  })

  it('includes and parses custom rate for custom strategy', () => {
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

  it('rejects custom strategy links without rate', () => {
    const parsed = parseResultDeepLink({
      goal: 'travel',
      target: '10000',
      years: '6',
      strategy: 'custom',
    })

    expect(parsed).toBeNull()
  })

  it('rejects invalid numeric input', () => {
    const parsed = parseResultDeepLink({
      goal: 'travel',
      target: '0',
      years: '6',
      strategy: 'balanced',
    })

    expect(parsed).toBeNull()
  })
})
