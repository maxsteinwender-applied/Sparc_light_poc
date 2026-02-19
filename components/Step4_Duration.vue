<script setup lang="ts">
import { computed } from 'vue'
import { useWizard } from '../composables/useWizard'
import { getStaggerItemVariants } from '../motion/presets'
import { useMotionSafety } from '../motion/useMotionSafety'
import { getGoal } from './goalsData'
import NumericInputStepper from './ui/NumericInputStepper.vue'

const {
  setStep,
  durationYears,
  setDurationYears,
  goal,
  customGoalName,
  calculationFactors,
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

const quickOptions = computed(() => currentGoal.value.typicalTimeHorizonOptions)

const handleBack = () => {
  if (calculationFactors.value.length > 0) {
    setStep(3)
    return
  }

  setStep(2)
}

const handleShowResult = () => {
  setStep(5)
}
</script>

<template>
  <div class="relative mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center px-4 pb-12 pt-20">
    <button
      type="button"
      class="ui-text-secondary absolute left-4 top-8 flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#003745] md:left-0 md:top-8"
      @click="handleBack"
    >
      Zurück
    </button>

    <div class="w-full">
      <div class="mb-12 text-center">
        <span class="mb-3 block text-sm font-medium uppercase tracking-widest text-[#EE0000]">Schritt 4 von 5</span>
        <h2 class="mb-4 text-3xl font-bold text-[#003745] md:text-4xl">Wann möchten Sie {{ goalLabel }} erreichen?</h2>
      </div>

      <div class="mb-12 grid grid-cols-3 gap-4">
        <button
          v-for="(years, optionIndex) in quickOptions"
          :key="years"
          v-motion
          :initial="optionInitial(optionIndex)"
          :enter="optionEnter(optionIndex)"
          type="button"
          :aria-pressed="durationYears === years ? 'true' : 'false'"
          class="ui-option-card py-4 text-lg font-medium"
          :class="
            durationYears === years
              ? 'is-selected text-[#003745]'
              : 'ui-text-secondary hover:border-[#003745]'
          "
          @click="setDurationYears(years)"
        >
          in {{ years }} Jahren
        </button>
      </div>

      <div class="mb-8 flex flex-col items-center rounded-[4px] border border-[#003745]/20 bg-white p-8">
        <div class="w-full max-w-sm">
          <NumericInputStepper
            :value="durationYears"
            :min="1"
            :max="40"
            :step="1"
            label="Laufzeit manuell anpassen"
            unit="Jahre"
            :note="`Zieljahr ${targetYear}`"
            @update:value="setDurationYears"
          />
        </div>
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
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <span class="ui-text-secondary mb-4 block text-sm">Fast geschafft. Gleich sehen Sie Ihren Plan.</span>
        <button
          type="button"
          class="ui-button ui-button-solid motion-cta w-full px-12 py-3 md:w-auto"
          @click="handleShowResult"
        >
          Ergebnis anzeigen
        </button>
      </div>
    </div>
  </div>
</template>
