import { storeToRefs } from 'pinia'
import { useWizardStore } from '../stores/wizard'
import type { GoalId } from '../components/goalsData'
import type { StrategyType, WizardGoalDefaults } from '../stores/wizard'

export const useWizard = () => {
  const wizardStore = useWizardStore()
  const {
    step,
    previousStep,
    transitionDirection,
    goal,
    customGoalName,
    targetAmount,
    durationYears,
    selectedStrategy,
    customAnnualRate,
    calculationFactors,
  } = storeToRefs(wizardStore)

  return {
    step,
    previousStep,
    transitionDirection,
    goal,
    customGoalName,
    targetAmount,
    durationYears,
    selectedStrategy,
    customAnnualRate,
    calculationFactors,
    setStep: (stepValue: number, options?: { previousStep?: number | null }) =>
      wizardStore.setStep(stepValue, options),
    setGoal: (goalValue: GoalId) => wizardStore.setGoal(goalValue),
    setCustomGoalName: (name: string) => wizardStore.setCustomGoalName(name),
    setTargetAmount: (amount: number) => wizardStore.setTargetAmount(amount),
    setDurationYears: (years: number) => wizardStore.setDurationYears(years),
    setSelectedStrategy: (strategy: StrategyType) => wizardStore.setSelectedStrategy(strategy),
    setCustomAnnualRate: (rate: number) => wizardStore.setCustomAnnualRate(rate),
    setCalculationFactors: (factors: string[]) => wizardStore.setCalculationFactors(factors),
    toggleCalculationFactor: (factor: string) => wizardStore.toggleCalculationFactor(factor),
    applyGoalDefaults: (defaults: WizardGoalDefaults) => wizardStore.applyGoalDefaults(defaults),
    resetFlow: () => wizardStore.resetFlow(),
  }
}
