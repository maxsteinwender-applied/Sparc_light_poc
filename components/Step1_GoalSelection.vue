<script setup lang="ts">
import { computed } from 'vue'
import { useWizard } from '../composables/useWizard'
import { normalizeCustomGoalName } from '../domain/wizardValidation'
import { GOALS, getGoal } from './goalsData'
import type { GoalId } from './goalsData'
import GoalCarousel3D from './GoalCarousel3D.vue'

const {
  goal,
  customGoalName,
  setStep,
  setCustomGoalName,
  applyGoalDefaults,
} = useWizard()

const standardGoals = computed(() => GOALS.filter((entry) => entry.id !== 'custom'))
const isCustomMode = computed(() => goal.value === 'custom')

const selectedGoalLabel = computed(() => {
  return GOALS.find((entry) => entry.id === goal.value)?.label ?? 'diesem Ziel'
})

const customGoalNameInput = computed({
  get: () => customGoalName.value,
  set: (value: string) => setCustomGoalName(value),
})

const handleGoalSelect = (id: GoalId) => {
  const selectedGoal = getGoal(id)

  applyGoalDefaults({
    goal: id,
    targetAmount: selectedGoal.baseTargetAmount,
    durationYears: selectedGoal.defaultTimeHorizonYears,
    selectedStrategy: selectedGoal.defaultStrategy,
    clearCustomGoalName: id !== 'custom',
  })
}

const handleContinue = () => {
  if (goal.value === 'custom') {
    const normalizedName = normalizeCustomGoalName(customGoalName.value)
    if (!normalizedName) {
      return
    }
    setCustomGoalName(normalizedName)
  }

  setStep(2)
}

const canContinue = computed(() => {
  if (goal.value !== 'custom') {
    return true
  }

  return normalizeCustomGoalName(customGoalName.value).length > 0
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8 text-center md:py-12">
    <div class="relative z-10 mb-8 md:mb-12">
      <span class="mb-3 block text-sm font-medium uppercase tracking-widest text-[#EE0000]">Schritt 1 von 5</span>
      <h1 class="mb-4 text-3xl font-bold tracking-tight text-[#003745] md:text-5xl">Wofür möchten Sie sparen?</h1>
      <p class="ui-text-secondary text-lg font-light md:text-xl">Ihr Ziel bestimmt alle weiteren Schritte.</p>
    </div>

    <div v-if="!isCustomMode" class="w-full">
      <div class="mb-8 w-full">
        <GoalCarousel3D :selected-goal-id="goal" :goals="standardGoals" @select="handleGoalSelect" />
      </div>

      <div class="mx-auto mt-8 flex w-full max-w-md flex-col items-center gap-4">
        <span class="ui-text-secondary mb-1 block text-sm">Als Nächstes bestimmen wir den Betrag.</span>
        <button
          type="button"
          class="ui-button ui-button-primary motion-cta h-auto w-full px-8 py-4 text-lg"
          @click="handleContinue"
        >
          Mit {{ selectedGoalLabel }} fortfahren
        </button>
        <button type="button" class="ui-button ui-button-ghost h-auto min-h-0 p-0 font-medium hover:underline" @click="handleGoalSelect('custom')">
          Individuelles Sparziel erstellen
        </button>
      </div>
    </div>

    <div v-else class="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
      <div class="w-full rounded-[var(--radius-card)] border border-[#003745]/10 bg-white p-8 shadow-[var(--shadow-card)]">
        <div class="w-full space-y-4 text-left">
          <label for="custom-goal-name" class="block text-lg font-semibold text-[#003745]">Name Ihres Sparziels</label>
          <input
            id="custom-goal-name"
            v-model="customGoalNameInput"
            type="text"
            autocomplete="off"
            placeholder="z. B. Auszeit, Hochzeit, Sicherheitspuffer..."
            class="ui-input w-full p-4 text-lg"
          />
          <p class="ui-text-secondary text-sm">Definieren Sie Ihr eigenes Ziel. Wir helfen bei Betrag, Zeitraum und Plan.</p>
        </div>
      </div>

      <div class="flex w-full flex-col items-center gap-4">
        <span class="ui-text-secondary mb-1 block text-sm">Als Nächstes bestimmen wir den Betrag.</span>
        <button
          type="button"
          :disabled="!canContinue"
          class="ui-button ui-button-primary motion-cta h-auto w-full px-8 py-4 text-lg"
          @click="handleContinue"
        >
          Mit individuellem Ziel fortfahren
        </button>
        <button type="button" class="ui-button ui-button-ghost ui-text-secondary h-auto min-h-0 p-0 text-sm hover:text-[#003745] hover:underline" @click="handleGoalSelect('travel')">
          Zurück zur Auswahl
        </button>
      </div>
    </div>
  </div>
</template>
