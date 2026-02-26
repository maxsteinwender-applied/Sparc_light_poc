<script setup lang="ts">
import { computed } from 'vue'
import { useWizard } from '../composables/useWizard'
import { calculateSavingsPlan } from '../domain/savingsPlan'
import { getStaggerItemVariants } from '../motion/presets'
import { useMotionSafety } from '../motion/useMotionSafety'
import { getGoal } from './goalsData'
import { resolveGoalSymbol } from './ui/goalSymbol'
import { formatCurrency } from './ui/utils'
import NumericInputStepper from './ui/NumericInputStepper.vue'

const {
  setStep,
  previousStep,
  durationYears,
  setDurationYears,
  goal,
  customGoalName,
  targetAmount,
  selectedStrategy,
  customAnnualRate,
  durationSelectionMode,
  setDurationSelectionMode,
} = useWizard()

const currentGoal = computed(() => getGoal(goal.value))
const currentYear = computed(() => new Date().getFullYear())
const targetYear = computed(() => currentYear.value + durationYears.value)
const { prefersReducedMotion } = useMotionSafety()

const optionInitial = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).initial
const optionEnter = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).enter

const goalLabel = computed(() => {
  if (goal.value === 'custom') {
    return customGoalName.value || 'Ihr Ziel'
  }

  return currentGoal.value.label
})
const goalSymbol = computed(() => resolveGoalSymbol(currentGoal.value.icon))

const quickOptions = computed(() => currentGoal.value.typicalTimeHorizonOptions)
const selectedAnnualRate = computed(() => {
  if (selectedStrategy.value === 'custom') {
    return customAnnualRate.value
  }

  return currentGoal.value.strategies[selectedStrategy.value].rate
})
const projectionPreview = computed(() => {
  return calculateSavingsPlan({
    targetAmount: targetAmount.value,
    durationYears: durationYears.value,
    annualRate: selectedAnnualRate.value,
  })
})
const canContinue = computed(() => durationSelectionMode.value !== null)
const durationModeSummary = computed(() => {
  if (durationSelectionMode.value === 'preset') {
    return 'Sie nutzen einen empfohlenen Zeitraum.'
  }

  if (durationSelectionMode.value === 'stepper') {
    return 'Sie haben die Laufzeit manuell angepasst.'
  }

  return 'Bitte wählen Sie einen Weg: empfohlenen Zeitraum oder manuelle Anpassung.'
})
const recommendationReason = computed(() => {
  if (currentGoal.value.whatItMeans.length === 0) {
    return 'Die empfohlenen Zeiträume basieren auf typischen Verläufen für dieses Sparziel.'
  }

  return currentGoal.value.whatItMeans.slice(0, 2).join(' ')
})

const handleBack = () => {
  if (previousStep.value === 2 || previousStep.value === 3) {
    setStep(previousStep.value)
    return
  }

  setStep(2)
}

const selectPresetDuration = (years: number) => {
  setDurationSelectionMode('preset')
  setDurationYears(years)
}

const updateStepperDuration = (years: number) => {
  setDurationSelectionMode('stepper')
  setDurationYears(years)
}

const activateStepperMode = () => {
  setDurationSelectionMode('stepper')
}

const handleShowResult = () => {
  if (!canContinue.value) {
    return
  }

  setStep(5)
}
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center px-4 pb-12 pt-12">
    <div class="w-full">
      <div class="mb-8 text-center">
        <div class="mb-4 flex justify-center">
          <div class="inline-flex flex-wrap items-center justify-center gap-2 rounded-[4px] bg-[#F1F3F4] px-3 py-2 text-sm text-[#003745]">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1A6B80] text-white">
              <span class="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">{{ goalSymbol }}</span>
            </span>
            <span class="font-semibold">{{ goalLabel }}</span>
            <span aria-hidden="true" class="text-[#7F949C]">·</span>
            <span>Zielbetrag: <span class="font-semibold">{{ formatCurrency(targetAmount) }}</span></span>
          </div>
        </div>
        <h2 class="mb-4 text-[32px] font-bold text-[#003745]">Wann möchten Sie {{ goalLabel }} erreichen?</h2>
        <p class="rounded-[4px] border border-[#003745]/15 bg-[#F4F9FA] px-4 py-3 text-sm text-[#003745]">
          {{ durationModeSummary }}
        </p>
      </div>

      <div class="mb-4 rounded-[4px] border border-[#D8E5E8] bg-white p-4 text-sm text-[#003745]">
        <p class="font-semibold">Warum diese empfohlenen Zeiträume?</p>
        <p class="mt-1 leading-relaxed">{{ recommendationReason }}</p>
      </div>

      <div class="mb-10 grid grid-cols-3 gap-4">
        <button
          v-for="(years, optionIndex) in quickOptions"
          :key="years"
          v-motion
          :initial="optionInitial(optionIndex)"
          :enter="optionEnter(optionIndex)"
          type="button"
          :aria-pressed="durationSelectionMode === 'preset' && durationYears === years ? 'true' : 'false'"
          class="ui-option-card py-4 text-lg font-medium"
          :class="
            durationSelectionMode === 'preset' && durationYears === years
              ? 'is-selected text-[#003745]'
              : 'ui-text-secondary hover:border-[#003745]'
          "
          @click="selectPresetDuration(years)"
        >
          in {{ years }} Jahren
        </button>
      </div>

      <div
        class="mb-8 flex flex-col items-center rounded-[4px] border bg-white p-8"
        :class="durationSelectionMode === 'stepper' ? 'border-[#003745] shadow-[var(--shadow-card)]' : 'border-[#003745]/20'"
        role="button"
        tabindex="0"
        :aria-pressed="durationSelectionMode === 'stepper' ? 'true' : 'false'"
        @click="activateStepperMode"
        @keydown.enter.prevent="activateStepperMode"
        @keydown.space.prevent="activateStepperMode"
      >
        <div class="w-full max-w-sm">
          <NumericInputStepper
            :value="durationYears"
            :min="1"
            :max="40"
            :step="1"
            label="Laufzeit manuell anpassen"
            unit="Jahre"
            :note="`Zieljahr ${targetYear}`"
            help-text="Mit +/- passen Sie die Laufzeit schrittweise um jeweils 1 Jahr an."
            decrement-label="Laufzeit um ein Jahr verkürzen"
            increment-label="Laufzeit um ein Jahr verlängern"
            @update:value="updateStepperDuration"
          />
        </div>
      </div>

      <div class="mb-8 rounded-[4px] border border-[#E6EEF0] bg-[#F4F9FA] p-5 text-sm leading-relaxed text-[#003745]">
        <p class="font-semibold">Auswirkung Ihrer Laufzeitwahl</p>
        <p class="mt-1">
          Mit {{ durationYears }} Jahren liegt die aktuelle monatliche Sparrate bei
          <span class="font-semibold">{{ formatCurrency(projectionPreview.monthlySavings) }}</span>.
          Kürzere Laufzeit erhöht meist die Rate, längere Laufzeit senkt sie häufig.
        </p>
      </div>

      <div
        v-if="currentGoal.whatItMeans.length > 0"
        class="mb-8 flex items-start gap-4 rounded-[var(--radius-control)] border border-[#E6EEF0] bg-[#F4F9FA] p-5 text-sm leading-relaxed text-[#003745]"
      >
        <div class="shrink-0 rounded-[4px] border border-[#E6EEF0] bg-white p-2 font-semibold">Info</div>
        <div class="pt-1">
          <p class="mb-1 font-semibold">Gut zu wissen:</p>
          <ul class="list-disc space-y-1 pl-4">
            <li v-for="point in currentGoal.whatItMeans" :key="point">{{ point }}</li>
            <li>Die Laufzeit können Sie später in der Ergebnisansicht jederzeit erneut anpassen.</li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <span class="ui-text-secondary mb-4 block text-sm">Fast geschafft. Gleich sehen Sie Ihren Plan.</span>
        <button
          type="button"
          :disabled="!canContinue"
          class="ui-button ui-button-solid motion-cta w-full px-12 py-3 md:w-auto"
          @click="handleShowResult"
        >
          Ergebnis anzeigen
        </button>
      </div>

      <div class="mt-8 flex w-full justify-start">
        <button
          type="button"
          class="ui-button ui-button-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold"
          @click="handleBack"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
          Zurück
        </button>
      </div>
    </div>
  </div>
</template>
