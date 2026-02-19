import type { StrategyType } from '../stores/wizard'

export interface ResultDeepLinkInput {
  goal: string
  target: number
  years: number
  strategy: StrategyType
  rate?: number
}

const DEEP_LINK_STRATEGIES = new Set<StrategyType>([
  'security',
  'balanced',
  'growth',
  'custom',
])

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

export const buildResultDeepLink = (
  baseUrl: string,
  input: ResultDeepLinkInput,
): string => {
  const url = new URL(baseUrl)
  const target = Math.max(1, Math.round(input.target))
  const years = Math.max(1, Math.round(input.years))

  url.searchParams.set('goal', input.goal)
  url.searchParams.set('target', `${target}`)
  url.searchParams.set('years', `${years}`)
  url.searchParams.set('strategy', input.strategy)

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
  const strategyRaw = getFirstString(query.strategy)
  const target = parseQueryNumber(query.target)
  const years = parseQueryNumber(query.years)

  if (!goal || !strategyRaw || target === null || years === null) {
    return null
  }

  if (!DEEP_LINK_STRATEGIES.has(strategyRaw as StrategyType)) {
    return null
  }

  if (target <= 0 || years <= 0) {
    return null
  }

  const strategy = strategyRaw as StrategyType
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
