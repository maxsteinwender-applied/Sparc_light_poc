<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWizard } from '../composables/useWizard'
import { calculateTargetAmountFromFactors } from '../domain/targetAmount'
import { parseEuroInput } from '../domain/wizardValidation'
import { getGoal } from './goalsData'
import { resolveGoalSymbol } from './ui/goalSymbol'
import { formatCurrency } from './ui/utils'

const {
  setStep,
  setTargetAmount,
  targetAmount,
  goal,
  customGoalName,
  calculationFactors,
  toggleCalculationFactor,
} = useWizard()

const formatAmountForInput = (value: number) => new Intl.NumberFormat('de-DE').format(value)
const formatEuro = (value: number) => `${value.toLocaleString('de-DE')} €`
const inputAmount = ref(targetAmount.value > 0 ? formatAmountForInput(targetAmount.value) : '')
const isEstimatorOpen = ref(false)

const currentGoal = computed(() => getGoal(goal.value))

const goalLabel = computed(() => {
  if (goal.value === 'custom') {
    return customGoalName.value || 'Ihr Ziel'
  }

  return currentGoal.value.label
})
const goalSymbol = computed(() => resolveGoalSymbol(currentGoal.value.icon))
const orientationValue = computed(() => currentGoal.value.baseTargetAmount)

const parsedAmount = computed(() => parseEuroInput(inputAmount.value))
const canContinue = computed(() => parsedAmount.value !== null)
const quickAmounts = computed(() => {
  const base = orientationValue.value
  const factors = [0.5, 0.75, 1.25, 1.5]
  const values = factors
    .map((factor) => Math.max(1_000, Math.round((base * factor) / 500) * 500))
    .filter((value) => value !== base)

  return [...new Set(values)]
})
const currentAmount = computed(() => parsedAmount.value ?? orientationValue.value)

const calculatedTargetAmount = computed(() => {
  return calculateTargetAmountFromFactors(
    orientationValue.value,
    currentGoal.value.amountFinderChips,
    calculationFactors.value,
  )
})
const calculatedDelta = computed(() => calculatedTargetAmount.value - orientationValue.value)

const handleAmountInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '')
  if (!digits) {
    inputAmount.value = ''
    return
  }

  inputAmount.value = formatAmountForInput(Number.parseInt(digits, 10))
  setTargetAmount(Number.parseInt(digits, 10))
}

const handleBack = () => {
  setStep(1)
}

const setAmountFromPreset = (value: number) => {
  inputAmount.value = formatAmountForInput(value)
  setTargetAmount(value)
}

const applyOrientationValue = () => {
  setAmountFromPreset(orientationValue.value)
}

const toggleEstimator = () => {
  isEstimatorOpen.value = !isEstimatorOpen.value
}

const isSelectedFactor = (label: string) => calculationFactors.value.includes(label)

const applyCalculatedAmount = () => {
  setAmountFromPreset(calculatedTargetAmount.value)
  isEstimatorOpen.value = false
}

const handleContinue = () => {
  if (parsedAmount.value === null) {
    return
  }

  setTargetAmount(parsedAmount.value)
  setStep(4, { previousStep: 2 })
}
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center px-4 pb-12 pt-12">
    <div class="mb-8 max-w-3xl text-center">
      <div class="mb-4 flex justify-center">
        <div class="inline-flex items-center gap-3 rounded-[4px] bg-[#F1F3F4] px-3 py-2 text-sm text-[#003745]">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1A6B80] text-white">
            <span class="material-symbols-outlined text-[18px] leading-none" aria-hidden="true">{{ goalSymbol }}</span>
          </span>
          <span class="font-semibold">{{ goalLabel }}</span>
        </div>
      </div>
      <h2 class="mb-4 text-[32px] font-bold text-[#003745]">Wie viel möchten Sie für Ihr Sparziel ansparen?</h2>
      <p class="ui-text-secondary text-base font-light">Geben Sie einen Ziel­betrag ein oder lassen Sie sich einen Betrag ermitteln.</p>
    </div>

    <div class="w-full space-y-4">
      <section class="rounded-[4px] border border-[#003745]/15 bg-white p-5 md:p-6">
        <div class="mb-5 flex items-center gap-2">
          <h3 class="text-xl font-bold text-[#003745]">Zielbetrag angeben</h3>
          <span class="ui-chip ui-chip-secondary-subtle">Direkter Weg</span>
        </div>
        <div class="space-y-4">
          <p class="text-sm font-semibold text-[#003745]">Passende Zielbeträge für dieses Ziel</p>
          <div class="grid gap-2 sm:grid-cols-4">
            <button
              v-for="amount in quickAmounts"
              :key="amount"
              type="button"
              class="ui-button h-auto px-3 py-2 text-sm font-semibold"
              :class="currentAmount === amount ? 'ui-button-solid' : 'ui-button-secondary'"
              @click="setAmountFromPreset(amount)"
            >
              {{ formatEuro(amount) }}
            </button>
          </div>
          <div class="pt-2">
            <label for="target-amount-input" class="mb-2 block text-sm font-semibold text-[#003745]">Zielbetrag</label>
          </div>
          <div class="relative">
            <input
              id="target-amount-input"
              :value="inputAmount"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="z. B. 12.500"
              class="ui-input h-14 w-full p-4 pr-14 text-lg"
              @input="handleAmountInput"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#1A6B80]" aria-hidden="true">EUR</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-[#003745]">
            <span class="material-symbols-outlined text-[16px] text-[var(--text-secondary)]" aria-hidden="true">info</span>
            <span>Orientierungswert für Ihr Sparziel <span class="font-semibold">{{ goalLabel }}</span>: <span class="font-semibold">{{ formatEuro(orientationValue) }}</span></span>
            <button
              type="button"
              class="font-semibold text-[#1A6B80] underline"
              @click="applyOrientationValue"
            >
              (übernehmen)
            </button>
          </div>
        </div>
      </section>

      <section class="overflow-hidden rounded-[4px] border border-[#003745]/15 bg-white">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 rounded-t-[4px] bg-[#F4F9FA] px-5 py-4 text-left"
          :aria-expanded="isEstimatorOpen ? 'true' : 'false'"
          @click="toggleEstimator"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-[#003745]" aria-hidden="true">calculate</span>
            <span class="text-xl font-bold text-[#003745]">Betrag ermitteln</span>
            <span class="ui-chip ui-chip-secondary-subtle">Geführter Weg</span>
          </div>
          <span class="material-symbols-outlined text-[18px] text-[#003745]" aria-hidden="true">
            {{ isEstimatorOpen ? 'expand_less' : 'expand_more' }}
          </span>
        </button>
        <div v-if="isEstimatorOpen" class="border-t border-[#E6EEF0] px-5 pb-5 pt-4">
          <p class="ui-text-secondary mb-4 text-sm leading-relaxed">
            Wählen Sie aus, was auf Ihr Sparziel zutrifft. Ihr Zielbetrag wird automatisch angepasst. Als Basis gilt der Orientierungswert: {{ formatEuro(orientationValue) }}.
          </p>
          <div class="flex flex-wrap gap-3 md:gap-4">
            <button
              v-for="chip in currentGoal.amountFinderChips"
              :key="chip.label"
              type="button"
              :aria-pressed="isSelectedFactor(chip.label) ? 'true' : 'false'"
              :class="[
                'ui-option-card relative flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-[14px] py-[12px] text-left',
                isSelectedFactor(chip.label) ? 'is-selected shadow-sm' : 'hover:border-[#003745]',
              ]"
              @click="toggleCalculationFactor(chip.label)"
            >
              <span class="text-xl leading-none" aria-hidden="true">{{ chip.emoji }}</span>
              <span class="whitespace-nowrap text-base font-medium text-[#003745]" :class="isSelectedFactor(chip.label) ? 'font-bold' : ''">
                {{ chip.label }}
              </span>
              <span
                class="ml-1 text-sm font-medium"
                :class="chip.cost === 0 ? 'ui-text-muted' : chip.cost > 0 ? 'text-[#277A6B]' : 'text-[#AD1111]'"
              >
                {{ chip.cost === 0 ? '± 0 EUR' : `${chip.cost > 0 ? '+' : '−'}${Math.abs(chip.cost).toLocaleString('de-DE')} EUR` }}
              </span>
              <span
                v-if="isSelectedFactor(chip.label)"
                class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#003745] text-xs font-bold text-white"
              >
                ✓
              </span>
            </button>
          </div>
          <div class="mt-4 rounded-[4px] border border-[#D8E5E8] bg-[#F4F9FA] p-4">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[#003745]">Errechneter Zielbetrag:</p>
                <p class="mt-1 text-2xl font-bold text-[#003745]">{{ formatCurrency(calculatedTargetAmount) }}</p>
                <p
                  class="mt-1 text-sm"
                  :class="calculatedDelta === 0 ? 'ui-text-secondary' : calculatedDelta > 0 ? 'text-[#277A6B]' : 'text-[#AD1111]'"
                >
                  {{ calculatedDelta === 0 ? 'Keine Differenz zur Basis' : `${calculatedDelta > 0 ? '+' : '−'}${Math.abs(calculatedDelta).toLocaleString('de-DE')} EUR durch Ihre Auswahl` }}
                </p>
              </div>
              <button
                type="button"
                class="ui-button ui-button-solid inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 text-sm md:ml-4 md:w-auto"
                @click="applyCalculatedAmount"
              >
                Betrag übernehmen
                <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
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
        @click="handleContinue"
      >
        Weiter zur Spardauer
      </button>
    </div>
  </div>
</template>
