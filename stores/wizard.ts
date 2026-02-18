import { defineStore } from 'pinia'
import type { GoalId } from '../components/goalsData'
import { clampDurationYears, clampTargetAmount } from '../domain/wizardValidation'

export type StrategyType = 'security' | 'balanced' | 'growth'

type GoalSelections = Partial<Record<GoalId, string[]>>

export interface WizardState {
  step: number
  transitionDirection: 1 | -1
  goal: GoalId
  customGoalName: string
  targetAmount: number
  durationYears: number
  selectedStrategy: StrategyType
  selections: GoalSelections
}

export interface WizardGoalDefaults {
  goal: GoalId
  targetAmount: number
  durationYears: number
  selectedStrategy: StrategyType
  clearCustomGoalName?: boolean
}

const DEFAULTS = {
  step: 1,
  transitionDirection: 1 as 1 | -1,
  goal: 'travel' as GoalId,
  customGoalName: '',
  targetAmount: 6000,
  durationYears: 2,
  selectedStrategy: 'balanced' as StrategyType,
}

const createInitialState = (): WizardState => ({
  ...DEFAULTS,
  selections: {},
})

export const useWizardStore = defineStore('wizard', {
  state: (): WizardState => createInitialState(),
  getters: {
    calculationFactors: (state): string[] => state.selections[state.goal] ?? [],
  },
  actions: {
    setStep(step: number) {
      const nextStep = Number.isFinite(step) ? Math.round(step) : this.step

      if (nextStep === this.step) {
        return
      }

      this.transitionDirection = nextStep > this.step ? 1 : -1
      this.step = nextStep
    },
    setGoal(goal: GoalId) {
      this.goal = goal
    },
    setCustomGoalName(name: string) {
      this.customGoalName = name
    },
    setTargetAmount(amount: number) {
      this.targetAmount = clampTargetAmount(amount)
    },
    setDurationYears(years: number) {
      this.durationYears = clampDurationYears(years)
    },
    setSelectedStrategy(strategy: StrategyType) {
      this.selectedStrategy = strategy
    },
    setCalculationFactors(factors: string[]) {
      this.selections = {
        ...this.selections,
        [this.goal]: [...factors],
      }
    },
    toggleCalculationFactor(factor: string) {
      const currentFactors = this.selections[this.goal] ?? []
      const nextFactors = currentFactors.includes(factor)
        ? currentFactors.filter((entry) => entry !== factor)
        : [...currentFactors, factor]

      this.selections = {
        ...this.selections,
        [this.goal]: nextFactors,
      }
    },
    applyGoalDefaults(defaults: WizardGoalDefaults) {
      this.goal = defaults.goal
      this.targetAmount = clampTargetAmount(defaults.targetAmount)
      this.durationYears = clampDurationYears(defaults.durationYears)
      this.selectedStrategy = defaults.selectedStrategy
      this.selections = {
        ...this.selections,
        [defaults.goal]: [],
      }

      if (defaults.clearCustomGoalName ?? defaults.goal !== 'custom') {
        this.customGoalName = ''
      }
    },
    resetFlow() {
      Object.assign(this, createInitialState())
    },
  },
})
