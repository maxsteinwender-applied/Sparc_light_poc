import { storeToRefs } from 'pinia'
import { useWizardStore } from '../stores/wizard'
import type { GoalId } from '../components/goalsData'
import type { StrategyType, WizardGoalDefaults } from '../stores/wizard'

export const useWizard = () => {
  const wizardStore = useWizardStore()
  const {
    step,
    goal,
    customGoalName,
    targetAmount,
    durationYears,
    selectedStrategy,
    calculationFactors,
  } = storeToRefs(wizardStore)

  return {
    step,
    goal,
    customGoalName,
    targetAmount,
    durationYears,
    selectedStrategy,
    calculationFactors,
    setStep: (stepValue: number) => wizardStore.setStep(stepValue),
    setGoal: (goalValue: GoalId) => wizardStore.setGoal(goalValue),
    setCustomGoalName: (name: string) => wizardStore.setCustomGoalName(name),
    setTargetAmount: (amount: number) => wizardStore.setTargetAmount(amount),
    setDurationYears: (years: number) => wizardStore.setDurationYears(years),
    setSelectedStrategy: (strategy: StrategyType) => wizardStore.setSelectedStrategy(strategy),
    setCalculationFactors: (factors: string[]) => wizardStore.setCalculationFactors(factors),
    toggleCalculationFactor: (factor: string) => wizardStore.toggleCalculationFactor(factor),
    applyGoalDefaults: (defaults: WizardGoalDefaults) => wizardStore.applyGoalDefaults(defaults),
    resetFlow: () => wizardStore.resetFlow(),
  }
}
