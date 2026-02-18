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
      <p class="text-lg font-light text-[#568996] md:text-xl">Ihr Ziel bestimmt alle weiteren Schritte.</p>
    </div>

    <div v-if="!isCustomMode" class="w-full">
      <div class="mb-8 w-full">
        <GoalCarousel3D :selected-goal-id="goal" :goals="standardGoals" @select="handleGoalSelect" />
      </div>

      <div class="mx-auto mt-8 flex w-full max-w-md flex-col items-center gap-4">
        <span class="mb-1 block text-sm text-[#568996]">Als Nächstes bestimmen wir den Betrag.</span>
        <button
          type="button"
          class="motion-cta h-auto w-full rounded-[4px] bg-[#EE0000] px-8 py-4 text-lg text-white transition-colors hover:bg-[#D00000]"
          @click="handleContinue"
        >
          Mit {{ selectedGoalLabel }} fortfahren
        </button>
        <button type="button" class="font-medium text-[#003745] hover:underline" @click="handleGoalSelect('custom')">
          Individuelles Sparziel erstellen
        </button>
      </div>
    </div>

    <div v-else class="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
      <div class="w-full rounded-lg border border-[#003745]/10 bg-white p-8 shadow-sm">
        <div class="w-full space-y-4 text-left">
          <label for="custom-goal-name" class="block text-lg font-semibold text-[#003745]">Name Ihres Sparziels</label>
          <input
            id="custom-goal-name"
            v-model="customGoalNameInput"
            type="text"
            autocomplete="off"
            placeholder="z. B. Auszeit, Hochzeit, Sicherheitspuffer..."
            class="w-full rounded-[4px] border border-[#003745]/20 p-4 text-lg text-[#003745] outline-none focus:border-[#003745] focus:ring-1 focus:ring-[#003745]"
          />
          <p class="text-sm text-[#568996]">Definieren Sie Ihr eigenes Ziel. Wir helfen bei Betrag, Zeitraum und Plan.</p>
        </div>
      </div>

      <div class="flex w-full flex-col items-center gap-4">
        <span class="mb-1 block text-sm text-[#568996]">Als Nächstes bestimmen wir den Betrag.</span>
        <button
          type="button"
          :disabled="!canContinue"
          class="motion-cta h-auto w-full rounded-[4px] bg-[#EE0000] px-8 py-4 text-lg text-white transition-colors hover:bg-[#D00000] disabled:cursor-not-allowed disabled:bg-[#D5DEE1]"
          @click="handleContinue"
        >
          Mit individuellem Ziel fortfahren
        </button>
        <button type="button" class="text-sm text-[#568996] hover:text-[#003745] hover:underline" @click="handleGoalSelect('travel')">
          Zurück zur Auswahl
        </button>
      </div>
    </div>
  </div>
</template>
