<script setup lang="ts">
import { computed, watch } from 'vue'
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

const PREVIEW_ANNUAL_RATE = 0.04
const monthlyCurrencyFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const infoPoints = [
  'Je länger der Zeitraum, desto mehr wirkt der Zinseszinseffekt.',
  'Regelmäßiges Sparen kann Schwankungen ausgleichen.',
]
const quickOptions = computed(() => currentGoal.value.typicalTimeHorizonOptions)
const quickOptionPreviews = computed(() => {
  return quickOptions.value.map((years) => ({
    years,
    monthlySavings: calculateSavingsPlan({
      targetAmount: targetAmount.value,
      durationYears: years,
      annualRate: PREVIEW_ANNUAL_RATE,
    }).monthlySavings,
  }))
})
const projectionPreview = computed(() => {
  return calculateSavingsPlan({
    targetAmount: targetAmount.value,
    durationYears: durationYears.value,
    annualRate: PREVIEW_ANNUAL_RATE,
  })
})
const formatMonthlyRate = (value: number) => `${monthlyCurrencyFormatter.format(value)} €`
const formatMonthlyEstimate = (value: number) => `~${monthlyCurrencyFormatter.format(value)} EUR/Mo.`
const canContinue = computed(() => durationSelectionMode.value !== null)

watch(
  [durationSelectionMode, quickOptions],
  ([mode, options]) => {
    if (mode !== null || options.length === 0) {
      return
    }

    const middleIndex = Math.floor(options.length / 2)
    const middleYears = options[middleIndex]
    if (!Number.isFinite(middleYears)) {
      return
    }

    setDurationYears(middleYears)
    setDurationSelectionMode('preset')
  },
  { immediate: true },
)

const handleBack = () => {
  if (previousStep.value === 2) {
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
        <h2 class="mb-4 text-[32px] font-bold text-[#003745]">Wann möchten Sie Ihr Sparziel erreichen?</h2>
        <p class="ui-text-secondary text-base font-light">
          Wählen Sie eine empfohlene Spardauer oder geben Sie eine eigene Spardauer ein.
        </p>
      </div>

      <section class="mb-8 rounded-[4px] border border-[#003745]/15 bg-white p-5 md:p-6">
        <div class="mb-5 flex items-center gap-2">
          <h3 class="text-xl font-bold text-[#003745]">Spardauer angeben</h3>
        </div>
        <div class="space-y-4">
          <p class="text-sm font-semibold text-[#003745]">Empfohlene Spardauern für dieses Ziel</p>
          <div class="grid gap-2 sm:grid-cols-3">
            <button
              v-for="({ years, monthlySavings }, optionIndex) in quickOptionPreviews"
              :key="years"
              v-motion
              :initial="optionInitial(optionIndex)"
              :enter="optionEnter(optionIndex)"
              type="button"
              :aria-pressed="durationSelectionMode === 'preset' && durationYears === years ? 'true' : 'false'"
              class="ui-button h-auto px-3 py-2 text-sm font-semibold"
              :class="
                durationSelectionMode === 'preset' && durationYears === years
                  ? 'ui-button-solid'
                  : 'ui-button-secondary'
              "
              @click="selectPresetDuration(years)"
            >
              <span class="block">in {{ years }} Jahren</span>
              <span
                class="mt-1 block text-xs font-normal"
                :class="durationSelectionMode === 'preset' && durationYears === years ? 'text-white/80' : 'ui-text-secondary'"
              >
                {{ formatMonthlyEstimate(monthlySavings) }}
              </span>
            </button>
          </div>
          <div class="pt-2">
            <p class="mb-2 text-sm font-semibold text-[#003745]">Spardauer</p>
            <div class="w-full" @click="activateStepperMode" @focusin="activateStepperMode">
              <NumericInputStepper
                :value="durationYears"
                :min="1"
                :max="40"
                :step="1"
                unit="Jahre"
                decrement-label="Laufzeit um ein Jahr verkürzen"
                increment-label="Laufzeit um ein Jahr verlängern"
                @update:value="updateStepperDuration"
              />
            </div>
            <div class="mt-4 flex items-center gap-2 text-sm text-[#003745]">
              <span class="material-symbols-outlined text-[16px] text-[var(--text-secondary)]" aria-hidden="true">info</span>
              <span>
                Sie erreichen Ihr Ziel im <span class="font-semibold">Jahr {{ targetYear }}</span>. Bitte wählen Sie eine Spardauer zwischen 1 und 40 Jahren.
              </span>
            </div>
          </div>
        </div>
      </section>

      <div class="mb-8 rounded-[4px] bg-[#1A6B80] p-5 text-white">
        <p class="text-sm font-medium">Voraussichtliche monatliche Sparrate (bei 4 % p.a.)</p>
        <p class="mt-2 text-5xl font-bold leading-none">{{ formatMonthlyRate(projectionPreview.monthlySavings) }}</p>
        <p class="mt-2 text-sm text-white/85">für {{ formatCurrency(targetAmount) }} in {{ durationYears }} Jahren</p>
        <p class="mt-4 text-sm text-white/80">
          Im nächsten Schritt legen Sie die Renditeannahme fest. Die Werte hier sind eine erste Orientierung.
        </p>
      </div>

      <div
        v-if="infoPoints.length > 0"
        class="mb-8 rounded-[var(--radius-control)] border border-[#E6EEF0] bg-[#F4F9FA] p-5 text-sm leading-relaxed text-[#003745]"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-[#003745]" aria-hidden="true">lightbulb</span>
          <p class="text-base font-semibold">Gut zu wissen:</p>
        </div>
        <ul class="mt-2 list-inside list-disc space-y-1">
          <li v-for="point in infoPoints" :key="point">{{ point }}</li>
        </ul>
      </div>

      <div class="mt-8 flex w-full items-center justify-between gap-3">
        <button
          type="button"
          class="group inline-flex h-auto items-center gap-1 py-4 text-base font-semibold text-[#1A6B80]"
          @click="handleBack"
        >
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_left</span>
          <span class="group-hover:underline">Zurück</span>
        </button>
        <button
          type="button"
          :disabled="!canContinue"
          class="ui-button ui-button-primary motion-cta h-auto px-8 py-4 text-lg"
          @click="handleShowResult"
        >
          Ergebnis anzeigen
        </button>
      </div>
    </div>
  </div>
</template>
