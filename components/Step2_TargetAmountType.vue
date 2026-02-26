<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWizard } from '../composables/useWizard'
import { parseEuroInput } from '../domain/wizardValidation'
import { getStaggerItemVariants } from '../motion/presets'
import { useMotionSafety } from '../motion/useMotionSafety'
import { getGoal } from './goalsData'

const {
  setStep,
  setTargetAmount,
  targetAmount,
  goal,
  customGoalName,
  amountSelectionMode,
  setAmountSelectionMode,
} = useWizard()

const formatAmountForInput = (value: number) => new Intl.NumberFormat('de-DE').format(value)
const inputAmount = ref(targetAmount.value > 0 ? formatAmountForInput(targetAmount.value) : '')

const currentGoal = computed(() => getGoal(goal.value))

const goalLabel = computed(() => {
  if (goal.value === 'custom') {
    return customGoalName.value || 'Ihr Ziel'
  }

  return currentGoal.value.label
})

const parsedAmount = computed(() => parseEuroInput(inputAmount.value))
const isManualSelected = computed(() => amountSelectionMode.value === 'manual')
const isGuidedSelected = computed(() => amountSelectionMode.value === 'guided')
const canContinueManual = computed(() => isManualSelected.value && parsedAmount.value !== null)
const canContinueGuided = computed(() => isGuidedSelected.value)
const { prefersReducedMotion } = useMotionSafety()

const cardInitial = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).initial
const cardEnter = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).enter

const handleAmountInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '')
  if (!digits) {
    inputAmount.value = ''
    return
  }

  inputAmount.value = formatAmountForInput(Number.parseInt(digits, 10))
}

const selectManualMode = () => {
  setAmountSelectionMode('manual')
}

const selectGuidedMode = () => {
  setAmountSelectionMode('guided')
}

const handleManualSubmit = () => {
  if (parsedAmount.value === null || !isManualSelected.value) {
    return
  }

  setTargetAmount(parsedAmount.value)
  setStep(3, { previousStep: 2 })
}

const handleCalculateClick = () => {
  if (!isGuidedSelected.value) {
    return
  }

  setStep(3, { previousStep: 2 })
}

const handleBack = () => {
  setStep(1)
}
</script>

<template>
  <div class="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center px-4 pb-12 pt-20">
    <button
      type="button"
      class="ui-button ui-button-secondary absolute left-4 top-8 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold md:left-0 md:top-8"
      @click="handleBack"
    >
      <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
      Zurück
    </button>

    <div class="mb-10 max-w-3xl text-center">
      <h2 class="mb-4 text-3xl font-bold text-[#003745] md:text-4xl">Wie viel möchten Sie für {{ goalLabel }} ansparen?</h2>
      <p class="ui-text-secondary text-lg font-light md:text-xl">{{ currentGoal.shortTeaser }}</p>
      <p class="mt-4 rounded-[4px] border border-[#003745]/15 bg-[#F4F9FA] px-4 py-3 text-sm text-[#003745]">
        Wählen Sie genau einen Weg: direkt Betrag eingeben oder Betrag gemeinsam ermitteln.
      </p>
    </div>

    <div class="grid w-full items-stretch gap-8 md:grid-cols-2">
      <article
        v-motion
        :initial="cardInitial(0)"
        :enter="cardEnter(0)"
        class="ui-option-card flex flex-col rounded-[var(--radius-card)] p-8"
        :class="isManualSelected ? 'is-selected' : ''"
        role="button"
        tabindex="0"
        :aria-pressed="isManualSelected ? 'true' : 'false'"
        @click="selectManualMode"
        @keydown.enter.prevent="selectManualMode"
        @keydown.space.prevent="selectManualMode"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <span class="ui-chip ui-chip-secondary-subtle">Direkter Weg</span>
          <span class="text-xs font-semibold text-[#003745]">Schätzung vorhanden</span>
        </div>
        <h3 class="mb-3 text-xl font-bold text-[#003745]">Betrag eingeben</h3>
        <p class="ui-text-secondary mb-8">Sie kennen Ihre Zielsumme bereits und möchten direkt damit weiterarbeiten.</p>

        <div class="mt-auto space-y-4">
          <div class="relative">
            <input
              :value="inputAmount"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="z. B. 12.500"
              class="ui-input h-14 w-full p-4 pr-14 text-lg"
              @focus="selectManualMode"
              @input="handleAmountInput"
            >
            <span class="ui-text-muted absolute right-4 top-1/2 -translate-y-1/2 font-medium">EUR</span>
          </div>

          <div
            v-if="currentGoal.avgTargetAmountHint"
            class="flex gap-3 rounded-[4px] border border-[#E6EEF0] bg-[#F4F9FA] p-4 text-sm leading-relaxed text-[#003745]"
          >
            <span class="mt-0.5 shrink-0 font-semibold">Info</span>
            <span>{{ currentGoal.avgTargetAmountHint }}</span>
          </div>

          <div>
            <span class="ui-text-secondary mb-4 block text-center text-sm">Im nächsten Schritt können Sie die Kriterien verfeinern.</span>
            <button
              type="button"
              :disabled="!canContinueManual"
              class="ui-button motion-cta w-full px-4 py-3"
              :class="isManualSelected ? 'ui-button-solid' : 'ui-button-secondary'"
              @click.stop="handleManualSubmit"
            >
              Mit diesem Betrag fortfahren
            </button>
          </div>
        </div>
      </article>

      <article
        v-motion
        :initial="cardInitial(1)"
        :enter="cardEnter(1)"
        class="ui-option-card relative flex flex-col overflow-hidden rounded-[var(--radius-card)] p-8"
        :class="isGuidedSelected ? 'is-selected' : ''"
        role="button"
        tabindex="0"
        :aria-pressed="isGuidedSelected ? 'true' : 'false'"
        @click="selectGuidedMode"
        @keydown.enter.prevent="selectGuidedMode"
        @keydown.space.prevent="selectGuidedMode"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <span class="ui-chip ui-chip-secondary-subtle">Geführter Weg</span>
          <span class="text-xs font-semibold text-[#003745]">Orientierung gewünscht</span>
        </div>
        <h3 class="mb-3 text-xl font-bold text-[#003745]">Betrag ermitteln</h3>
        <p class="ui-text-secondary mb-6">Wir ermitteln den Betrag gemeinsam anhand Ihrer Prioritäten:</p>

        <div class="mb-8 flex flex-wrap content-start gap-2">
          <span
            v-for="category in currentGoal.amountFinderCategories"
            :key="category"
            class="inline-flex items-center rounded-full border border-[#E6EEF0] bg-[#F4F9FA] px-3 py-1.5 text-xs font-medium text-[#003745]"
          >
            {{ category }}
          </span>
        </div>

        <div class="mt-auto">
          <span class="ui-text-secondary mb-4 block text-center text-sm">Als Nächstes legen wir die wichtigsten Einflussfaktoren fest.</span>
          <button
            type="button"
            :disabled="!canContinueGuided"
            class="ui-button motion-cta w-full px-6 py-3.5 text-base"
            :class="isGuidedSelected ? 'ui-button-solid' : 'ui-button-secondary'"
            @click.stop="handleCalculateClick"
          >
            Betrag ermitteln
          </button>
        </div>
      </article>
    </div>
  </div>
</template>
