<script setup lang="ts">
import { computed, watch } from 'vue'
import { useWizard } from '../composables/useWizard'
import { calculateTargetAmountFromFactors } from '../domain/targetAmount'
import { getStaggerItemVariants } from '../motion/presets'
import { useMotionSafety } from '../motion/useMotionSafety'
import { getGoal } from './goalsData'
import { formatCurrency } from './ui/utils'

const {
  setStep,
  setTargetAmount,
  calculationFactors,
  toggleCalculationFactor,
  goal,
  customGoalName,
  amountSelectionMode,
} = useWizard()

const currentGoal = computed(() => getGoal(goal.value))

const goalLabel = computed(() => {
  if (goal.value === 'custom') {
    return customGoalName.value || 'Ihr Ziel'
  }

  return currentGoal.value.label
})

const currentTotal = computed(() => {
  return calculateTargetAmountFromFactors(
    currentGoal.value.baseTargetAmount,
    currentGoal.value.amountFinderChips,
    calculationFactors.value,
  )
})

const delta = computed(() => currentTotal.value - currentGoal.value.baseTargetAmount)
const { prefersReducedMotion } = useMotionSafety()

const chipInitial = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).initial
const chipEnter = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).enter

watch(
  currentTotal,
  (nextTotal) => {
    setTargetAmount(nextTotal)
  },
  { immediate: true },
)

const handleBack = () => {
  setStep(2)
}

const handleContinue = () => {
  setStep(4, {
    previousStep: calculationFactors.value.length > 0 ? 3 : 2,
  })
}

const isSelected = (label: string) => calculationFactors.value.includes(label)
const modeSummary = computed(() => {
  if (amountSelectionMode.value === 'manual') {
    return 'Sie haben bereits einen Startbetrag eingegeben. Jetzt können Sie die Summe mit den Kriterien feinjustieren.'
  }

  return 'Sie haben den geführten Weg gewählt. Wählen Sie jetzt die Kriterien, die Ihren Zielbetrag beeinflussen.'
})
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-6xl flex-col gap-8 px-4 pb-12 pt-12">
    <div class="flex w-full flex-col items-start gap-8 md:flex-row">
      <section class="w-full md:w-2/3">
      <h2 class="mb-8 px-2 text-[32px] font-bold text-[#003745]">Was ist Ihnen bei {{ goalLabel }} wichtig?</h2>
      <div class="mx-2 mb-6 rounded-[4px] border border-[#E6EEF0] bg-[#F4F9FA] p-4 text-sm text-[#003745]">
        <p class="font-semibold">Ihre Kriterien aus Schritt 2:</p>
        <p class="mt-1 leading-relaxed">{{ modeSummary }}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="category in currentGoal.amountFinderCategories"
            :key="category"
            class="inline-flex items-center rounded-full border border-[#D6E3E8] bg-white px-3 py-1 text-xs font-semibold text-[#1B4A5A]"
          >
            {{ category }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 md:gap-4">
        <button
          v-for="(chip, chipIndex) in currentGoal.amountFinderChips"
          :key="chip.label"
          v-motion
          :initial="chipInitial(chipIndex)"
          :enter="chipEnter(chipIndex)"
          type="button"
          :aria-pressed="isSelected(chip.label) ? 'true' : 'false'"
          :class="[
            'ui-option-card relative flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-[14px] py-[12px] text-left',
            isSelected(chip.label) ? 'is-selected shadow-sm' : 'hover:border-[#003745]',
          ]"
          @click="toggleCalculationFactor(chip.label)"
        >
          <span class="text-xl leading-none" aria-hidden="true">{{ chip.emoji }}</span>
          <span class="whitespace-nowrap text-base font-medium text-[#003745]" :class="isSelected(chip.label) ? 'font-bold' : ''">
            {{ chip.label }}
          </span>
          <span
            class="ml-1 text-sm font-medium"
            :class="chip.cost === 0 ? 'ui-text-muted' : chip.cost > 0 ? 'text-[#277A6B]' : 'text-[#AD1111]'"
          >
            {{ chip.cost === 0 ? '± 0 EUR' : `${chip.cost > 0 ? '+' : '−'}${Math.abs(chip.cost).toLocaleString('de-DE')} EUR` }}
          </span>
          <span
            v-if="isSelected(chip.label)"
            class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#003745] text-xs font-bold text-white"
          >
            ✓
          </span>
        </button>
      </div>

      <p class="ui-text-secondary mt-6 px-2 text-sm italic leading-relaxed">
        Ausgangspunkt ist ein typischer Durchschnittswert. Ihre Auswahl kann den Betrag erhöhen oder senken.
      </p>
      </section>

      <aside class="mt-2 w-full md:mt-0 md:w-1/3">
        <div class="relative overflow-hidden rounded-[var(--radius-card)] border border-[#003745]/20 bg-white p-8 shadow-[var(--shadow-card)] md:sticky md:top-[var(--app-sticky-content-offset)]">
          <div class="absolute left-0 top-0 h-2 w-full bg-[#003745]" />
          <h3 class="ui-text-secondary mb-2 text-xs font-bold uppercase tracking-wider">Zielbetrag</h3>

          <div class="text-5xl font-bold tracking-tight text-[#003745]" :class="delta !== 0 ? 'mb-2' : 'mb-6'">
            {{ formatCurrency(currentTotal) }}
          </div>

          <div
            v-if="delta !== 0"
            class="mb-6 text-lg font-medium"
            :class="delta > 0 ? 'text-[#277A6B]' : 'text-[#AD1111]'"
          >
            {{ delta > 0 ? '+' : '−' }}{{ Math.abs(delta).toLocaleString('de-DE') }} EUR durch Ihre Auswahl
          </div>

          <div class="mb-8 flex gap-3 rounded-[var(--radius-control)] border border-[#E6EEF0] bg-[#F4F9FA] p-4 text-sm text-[#003745]">
            <span class="shrink-0 font-semibold">Info</span>
            <p class="leading-relaxed">Dieser Wert dient als erste Orientierung für {{ goalLabel }}.</p>
          </div>

          <span class="ui-text-secondary mb-4 block text-center text-sm">Im nächsten Schritt legen Sie die Laufzeit fest.</span>
          <button
            type="button"
            class="ui-button ui-button-solid motion-cta w-full px-4 py-3"
            @click="handleContinue"
          >
            Weiter zur Laufzeit
          </button>
        </div>
      </aside>
    </div>

    <div class="flex w-full justify-start">
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
</template>
