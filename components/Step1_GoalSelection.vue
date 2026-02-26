<script setup lang="ts">
import { computed } from 'vue'
import { useWizard } from '../composables/useWizard'
import { normalizeCustomGoalName } from '../domain/wizardValidation'
import { GOALS, getGoal } from './goalsData'
import type { GoalId } from './goalsData'

const {
  goal,
  goalSelectionConfirmed,
  customGoalName,
  setStep,
  setCustomGoalName,
  applyGoalDefaults,
} = useWizard()

const isCustomMode = computed(() => goal.value === 'custom')
const orderedGoalIds: GoalId[] = ['wealth', 'retirement', 'kids', 'property', 'car', 'travel', 'purchase', 'custom']
const goalIconMap: Record<string, string> = {
  globe: 'flight',
  heart: 'child_care',
  hourglass: 'wb_twilight',
  home: 'home',
  gauge: 'directions_car',
  'credit-card': 'inventory_2',
  'piggy-bank': 'trending_up',
  'pen-tool': 'edit',
}
const goalSublines: Record<GoalId, string> = {
  wealth: 'Für finanzielle Unabhängigkeit und Sicherheit',
  retirement: 'Damit Sie im Ruhestand gut leben',
  kids: 'Für Ausbildung, Studium oder Start ins Leben',
  property: 'Eigenkapital für Ihr Eigenheim aufbauen',
  car: 'Für Ihr nächstes Fahrzeug ansparen',
  travel: 'Für unvergessliche Erlebnisse auf Reisen',
  purchase: 'Für größere Ausgaben im Alltag',
  custom: 'Sie wissen selbst, wofür Sie sparen',
}

const gridGoals = computed(() =>
  orderedGoalIds
    .map((id) => GOALS.find((entry) => entry.id === id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
)

const selectedGoalLabel = computed(() => {
  if (!goalSelectionConfirmed.value) {
    return 'ausgewähltem Sparziel'
  }

  if (goal.value === 'custom') {
    return 'individuellem Sparziel'
  }

  return GOALS.find((entry) => entry.id === goal.value)?.label ?? 'diesem Ziel'
})

const customGoalNameInput = computed({
  get: () => customGoalName.value,
  set: (value: string) => setCustomGoalName(value),
})

const getGoalCardLabel = (id: GoalId) => {
  if (id === 'custom') {
    return 'Individuelles Sparziel'
  }

  return GOALS.find((entry) => entry.id === id)?.label ?? 'Sparziel'
}

const getGoalCardIcon = (iconName?: string) => {
  if (!iconName) {
    return 'flag'
  }

  return goalIconMap[iconName] ?? 'flag'
}

const isGoalSelected = (id: GoalId) => goalSelectionConfirmed.value && goal.value === id

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
  if (!goalSelectionConfirmed.value) {
    return
  }

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
  if (!goalSelectionConfirmed.value) {
    return false
  }

  if (goal.value !== 'custom') {
    return true
  }

  return normalizeCustomGoalName(customGoalName.value).length > 0
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8 md:py-12">
    <div class="relative z-10 mb-8 md:mb-12">
      <h1 class="mb-4 text-center text-[32px] font-bold tracking-tight text-[#003745]">Wofür möchten Sie sparen?</h1>
      <p class="ui-text-secondary text-center text-base font-light">Wählen Sie ein Ziel – wir helfen Ihnen, die passende Sparrate zu finden.</p>
    </div>

    <div class="w-full space-y-8">
      <div class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          v-for="entry in gridGoals"
          :key="entry.id"
          type="button"
          role="option"
          :aria-label="`Ziel auswählen: ${getGoalCardLabel(entry.id)}`"
          :aria-selected="isGoalSelected(entry.id) ? 'true' : 'false'"
          :class="[
            'ui-option-card flex h-full flex-col rounded-[var(--radius-card)] border p-5 text-left',
            isGoalSelected(entry.id) ? 'is-selected border-[#003745]' : 'border-[#003745]/15 hover:border-[#003745]/45',
          ]"
          @click="handleGoalSelect(entry.id)"
        >
          <span class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[#1A6B80] text-white">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ getGoalCardIcon(entry.icon) }}</span>
          </span>
          <span class="text-2xl font-bold text-[#003745] sm:text-xl">{{ getGoalCardLabel(entry.id) }}</span>
          <span class="ui-text-secondary mt-1 text-sm font-medium">{{ goalSublines[entry.id] }}</span>
        </button>
      </div>

      <div
        v-if="isCustomMode"
        class="mx-auto w-full max-w-5xl rounded-[4px] border border-[#003745]/20 bg-[#F4F9FA] p-6"
      >
        <div class="space-y-3 text-left">
          <label for="custom-goal-name" class="block text-lg font-semibold text-[#003745]">Wie heißt Ihr Sparziel?</label>
          <input
            id="custom-goal-name"
            v-model="customGoalNameInput"
            type="text"
            autocomplete="off"
            placeholder="z. B. Weltreise, Hausbau, Musikstudio ..."
            class="ui-input w-full p-4 text-lg"
          >
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-md flex-col items-center gap-4">
        <span class="ui-text-secondary mb-1 block text-sm">Als Nächstes bestimmen wir den Betrag.</span>
        <button
          type="button"
          :disabled="!canContinue"
          class="ui-button ui-button-primary motion-cta h-auto w-full px-8 py-4 text-lg"
          @click="handleContinue"
        >
          Mit {{ selectedGoalLabel }} fortfahren
        </button>
      </div>
    </div>
  </div>
</template>
