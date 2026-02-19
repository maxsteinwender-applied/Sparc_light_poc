export interface SavingsProjectionPoint {
  year: number
  invested: number
  value: number
  zeroReturn: number
  isTargetProjection: boolean
  isTargetZero: boolean
}

export interface SavingsPlanInput {
  targetAmount: number
  durationYears: number
  annualRate: number
  showZeroReturn?: boolean
  currentYear?: number
}

export interface SavingsPlanResult {
  monthlySavings: number
  totalInvested: number
  totalReturn: number
  zeroReturnMonthly: number
  monthlyDifference: number
  targetYear: number
  yearsNeededZero: number
  chartData: SavingsProjectionPoint[]
}

export interface TimeGainInput {
  targetAmount: number
  baseMonthlySavings: number
  extraMonthlySavings: number
  annualRate: number
}

export interface TimeGainResult {
  baseMonths: number
  optimizedMonths: number
  monthsEarlier: number
}

const toFinitePositiveNumber = (value: number, fallback: number): number => {
  return Number.isFinite(value) && value > 0 ? value : fallback
}

export const calculateMonthsToTarget = ({
  targetAmount,
  monthlySavings,
  annualRate,
  maxMonths = 1_200,
}: {
  targetAmount: number
  monthlySavings: number
  annualRate: number
  maxMonths?: number
}): number | null => {
  if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
    return null
  }

  if (!Number.isFinite(monthlySavings) || monthlySavings <= 0) {
    return null
  }

  const boundedMonths = Number.isFinite(maxMonths) ? Math.max(1, Math.round(maxMonths)) : 1_200
  const monthlyRate = Number.isFinite(annualRate) ? annualRate / 12 : 0

  let months = 0
  let balance = 0

  while (balance < targetAmount && months < boundedMonths) {
    balance = (balance + monthlySavings) * (1 + monthlyRate)
    months += 1
  }

  if (balance < targetAmount) {
    return null
  }

  return months
}

export const calculateTimeGainWithExtraMonthly = ({
  targetAmount,
  baseMonthlySavings,
  extraMonthlySavings,
  annualRate,
}: TimeGainInput): TimeGainResult | null => {
  const safeExtra = Number.isFinite(extraMonthlySavings) ? Math.max(0, extraMonthlySavings) : 0
  const optimizedMonthlySavings = baseMonthlySavings + safeExtra

  const baseMonths = calculateMonthsToTarget({
    targetAmount,
    monthlySavings: baseMonthlySavings,
    annualRate,
  })
  const optimizedMonths = calculateMonthsToTarget({
    targetAmount,
    monthlySavings: optimizedMonthlySavings,
    annualRate,
  })

  if (baseMonths === null || optimizedMonths === null) {
    return null
  }

  return {
    baseMonths,
    optimizedMonths,
    monthsEarlier: Math.max(0, baseMonths - optimizedMonths),
  }
}

export const calculateSavingsPlan = ({
  targetAmount,
  durationYears,
  annualRate,
  showZeroReturn = false,
  currentYear = new Date().getFullYear(),
}: SavingsPlanInput): SavingsPlanResult => {
  const target = toFinitePositiveNumber(targetAmount, 1)
  const years = Math.max(1, Math.round(toFinitePositiveNumber(durationYears, 1)))
  const months = years * 12
  const rate = Number.isFinite(annualRate) ? annualRate : 0
  const monthlyRate = rate / 12

  let monthlyPayment = 0
  if (rate === 0) {
    monthlyPayment = target / months
  } else {
    const denominator = Math.pow(1 + monthlyRate, months) - 1
    monthlyPayment = denominator === 0 ? target / months : (target * monthlyRate) / denominator
  }

  if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) {
    monthlyPayment = target / months
  }

  const totalInvested = Math.round(monthlyPayment * months)
  const totalReturn = Math.round(target - totalInvested)
  const monthlySavings = Math.ceil(monthlyPayment)

  const monthsNeededZero = Math.ceil(target / monthlyPayment)
  const yearsNeededZero = Math.ceil(monthsNeededZero / 12)
  const chartDuration = showZeroReturn ? Math.max(years, yearsNeededZero) : years

  const chartData: SavingsProjectionPoint[] = []
  let currentBalance = 0
  let currentInvested = 0
  let zeroReturnBalance = 0

  for (let yearIndex = 0; yearIndex <= chartDuration; yearIndex += 1) {
    chartData.push({
      year: currentYear + yearIndex,
      invested: Math.round(currentInvested),
      value: Math.round(currentBalance),
      zeroReturn: Math.round(zeroReturnBalance),
      isTargetProjection: yearIndex === years,
      isTargetZero: yearIndex === yearsNeededZero,
    })

    for (let month = 0; month < 12; month += 1) {
      if (yearIndex < years) {
        currentBalance = (currentBalance + monthlyPayment) * (1 + monthlyRate)
        currentInvested += monthlyPayment
      } else {
        currentBalance *= 1 + monthlyRate
      }

      if (zeroReturnBalance < target) {
        zeroReturnBalance += monthlyPayment
      }
    }
  }

  const zeroReturnMonthly = Math.ceil(target / months)
  const monthlyDifference = zeroReturnMonthly - monthlySavings

  return {
    monthlySavings,
    totalInvested,
    totalReturn,
    zeroReturnMonthly,
    monthlyDifference,
    targetYear: currentYear + years,
    yearsNeededZero,
    chartData,
  }
}
