import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useWizardStore } from '../../stores/wizard'

describe('wizard store step history', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with step 1 and no previous step', () => {
    const store = useWizardStore()

    expect(store.step).toBe(1)
    expect(store.previousStep).toBeNull()
    expect(store.goalSelectionConfirmed).toBe(false)
    expect(store.durationSelectionMode).toBeNull()
  })

  it('tracks previousStep and transitionDirection across navigation', () => {
    const store = useWizardStore()

    store.setStep(2)
    expect(store.step).toBe(2)
    expect(store.previousStep).toBe(1)
    expect(store.transitionDirection).toBe(1)

    store.setStep(4)
    expect(store.step).toBe(4)
    expect(store.previousStep).toBe(2)
    expect(store.transitionDirection).toBe(1)

    store.setStep(5, { previousStep: 2 })
    expect(store.step).toBe(5)
    expect(store.previousStep).toBe(2)
    expect(store.transitionDirection).toBe(1)

    store.setStep(4)
    expect(store.step).toBe(4)
    expect(store.previousStep).toBe(5)
    expect(store.transitionDirection).toBe(-1)
  })

  it('resets previousStep when flow is reset', () => {
    const store = useWizardStore()

    store.setStep(5)
    store.setGoal('travel')
    store.setDurationSelectionMode('preset')
    expect(store.previousStep).toBe(1)

    store.resetFlow()
    expect(store.step).toBe(1)
    expect(store.previousStep).toBeNull()
    expect(store.transitionDirection).toBe(1)
    expect(store.goalSelectionConfirmed).toBe(false)
    expect(store.durationSelectionMode).toBeNull()
  })

  it('confirms goal selection and clears duration mode when applying goal defaults', () => {
    const store = useWizardStore()

    store.setDurationSelectionMode('stepper')
    store.applyGoalDefaults({
      goal: 'car',
      targetAmount: 12_000,
      durationYears: 4,
      selectedStrategy: 'security',
    })

    expect(store.goal).toBe('car')
    expect(store.goalSelectionConfirmed).toBe(true)
    expect(store.durationSelectionMode).toBeNull()
  })
})
