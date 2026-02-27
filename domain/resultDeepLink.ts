import type { StrategyType } from '../stores/wizard'

export interface ResultDeepLinkInput {
  goal: string
  target: number
  years: number
  strategy: StrategyType
  rate?: number
}

type InterestType = 'variant1' | 'variant2' | 'variant3' | 'custom'

const DEEP_LINK_STRATEGIES = new Set<StrategyType>([
  'security',
  'balanced',
  'growth',
  'custom',
])
const DEEP_LINK_INTERESTS = new Set<InterestType>([
  'variant1',
  'variant2',
  'variant3',
  'custom',
])
const MAX_DEEP_LINK_YEARS = 40

const getFirstString = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return null
}

const parseQueryNumber = (value: unknown): number | null => {
  const raw = getFirstString(value)
  if (raw === null) {
    return null
  }

  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

const strategyToInterest = (strategy: StrategyType): InterestType => {
  if (strategy === 'security') {
    return 'variant1'
  }
  if (strategy === 'balanced') {
    return 'variant2'
  }
  if (strategy === 'growth') {
    return 'variant3'
  }
  return 'custom'
}

const interestToStrategy = (interest: InterestType): StrategyType => {
  if (interest === 'variant1') {
    return 'security'
  }
  if (interest === 'variant2') {
    return 'balanced'
  }
  if (interest === 'variant3') {
    return 'growth'
  }
  return 'custom'
}

export const buildResultDeepLink = (
  baseUrl: string,
  input: ResultDeepLinkInput,
): string => {
  const url = new URL(baseUrl)
  const target = Math.max(1, Math.round(input.target))
  const years = Math.min(MAX_DEEP_LINK_YEARS, Math.max(1, Math.round(input.years)))

  url.searchParams.set('goal', input.goal)
  url.searchParams.set('target', `${target}`)
  url.searchParams.set('years', `${years}`)
  url.searchParams.set('interest', strategyToInterest(input.strategy))
  url.searchParams.delete('strategy')

  if (input.strategy === 'custom') {
    const rate = Number.isFinite(input.rate)
      ? Math.min(0.15, Math.max(0, input.rate as number))
      : 0
    url.searchParams.set('rate', `${rate}`)
  } else {
    url.searchParams.delete('rate')
  }

  return url.toString()
}

export const parseResultDeepLink = (
  query: Record<string, unknown>,
): ResultDeepLinkInput | null => {
  const goal = getFirstString(query.goal)
  const interestRaw = getFirstString(query.interest)
  const strategyLegacyRaw = getFirstString(query.strategy)
  const target = parseQueryNumber(query.target)
  const years = parseQueryNumber(query.years)
  let strategy: StrategyType | null = null

  if (!goal || target === null || years === null) {
    return null
  }

  if (interestRaw !== null) {
    if (!DEEP_LINK_INTERESTS.has(interestRaw as InterestType)) {
      return null
    }
    strategy = interestToStrategy(interestRaw as InterestType)
  } else if (strategyLegacyRaw !== null) {
    if (!DEEP_LINK_STRATEGIES.has(strategyLegacyRaw as StrategyType)) {
      return null
    }
    strategy = strategyLegacyRaw as StrategyType
  }

  if (strategy === null) {
    return null
  }

  if (
    target <= 0
    || years <= 0
    || years > MAX_DEEP_LINK_YEARS
    || !Number.isInteger(years)
  ) {
    return null
  }

  if (strategy === 'custom') {
    const rate = parseQueryNumber(query.rate)
    if (rate === null || rate < 0 || rate > 0.15) {
      return null
    }

    return {
      goal,
      target,
      years,
      strategy,
      rate,
    }
  }

  return {
    goal,
    target,
    years,
    strategy,
  }
}
