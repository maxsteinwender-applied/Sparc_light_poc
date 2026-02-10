const MAX_DURATION_YEARS = 40
const MIN_DURATION_YEARS = 1
const MIN_TARGET_AMOUNT = 1

export const parseEuroInput = (value: string): number | null => {
  const parsed = Number.parseInt(value.replace(/\D/g, ''), 10)
  if (!Number.isFinite(parsed) || parsed < MIN_TARGET_AMOUNT) {
    return null
  }

  return parsed
}

export const clampDurationYears = (value: number): number => {
  if (!Number.isFinite(value)) {
    return MIN_DURATION_YEARS
  }

  return Math.min(MAX_DURATION_YEARS, Math.max(MIN_DURATION_YEARS, Math.round(value)))
}

export const clampTargetAmount = (value: number): number => {
  if (!Number.isFinite(value)) {
    return MIN_TARGET_AMOUNT
  }

  return Math.max(MIN_TARGET_AMOUNT, Math.round(value))
}

export const normalizeCustomGoalName = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ')
}
