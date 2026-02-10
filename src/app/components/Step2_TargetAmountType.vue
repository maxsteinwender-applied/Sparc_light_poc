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
} = useWizard()

const inputAmount = ref(targetAmount.value > 0 ? String(targetAmount.value) : '')

const currentGoal = computed(() => getGoal(goal.value))

const goalLabel = computed(() => {
  if (goal.value === 'custom') {
    return customGoalName.value || 'Ihr Ziel'
  }

  return currentGoal.value.label
})

const parsedAmount = computed(() => parseEuroInput(inputAmount.value))
const { prefersReducedMotion } = useMotionSafety()

const cardInitial = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).initial
const cardEnter = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).enter

const handleManualSubmit = () => {
  if (parsedAmount.value === null) {
    return
  }

  setTargetAmount(parsedAmount.value)
  setStep(4)
}

const handleCalculateClick = () => {
  setStep(3)
}

const handleBack = () => {
  setStep(1)
}
</script>

<template>
  <div class="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center px-4 pb-12 pt-20">
    <button
      type="button"
      class="absolute left-4 top-8 flex items-center gap-2 text-sm font-medium text-[#568996] transition-colors hover:text-[#003745] md:left-0 md:top-8"
      @click="handleBack"
    >
      Zurück
    </button>

    <div class="mb-12 max-w-2xl text-center">
      <span class="mb-3 block text-sm font-medium uppercase tracking-widest text-[#EE0000]">Schritt 2 von 5</span>
      <h2 class="mb-4 text-3xl font-bold text-[#003745] md:text-4xl">Wie viel möchten Sie für {{ goalLabel }} ansparen?</h2>
      <p class="text-xl font-light text-[#568996]">{{ currentGoal.shortTeaser }}</p>
    </div>

    <div class="grid w-full items-stretch gap-8 md:grid-cols-2">
      <article
        v-motion
        :initial="cardInitial(0)"
        :enter="cardEnter(0)"
        class="flex flex-col rounded-[4px] border border-[#003745]/20 bg-white p-8 transition-[border-color,box-shadow,transform] duration-[180ms] ease-[var(--motion-ease-standard)] hover:border-[#003745] hover:shadow-lg"
      >
        <div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#F4F9FA] text-[#003745]">
          EUR
        </div>
        <h3 class="mb-3 text-xl font-bold text-[#003745]">Betrag eingeben</h3>
        <p class="mb-8 text-[#568996]">Sie haben bereits eine konkrete Summe im Kopf?</p>

        <div class="mt-auto space-y-4">
          <div class="relative">
            <input
              v-model="inputAmount"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="Betrag eingeben"
              class="h-14 w-full rounded-[4px] border border-[#003745]/20 p-4 pr-14 text-lg text-[#003745] outline-none focus:border-[#003745] focus:ring-1 focus:ring-[#003745]"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-[#9FB6BC]">EUR</span>
          </div>

          <div
            v-if="currentGoal.avgTargetAmountHint"
            class="flex gap-3 rounded-[4px] border border-[#E6EEF0] bg-[#F4F9FA] p-4 text-sm leading-relaxed text-[#003745]"
          >
            <span class="mt-0.5 shrink-0 font-semibold">Info</span>
            <span>{{ currentGoal.avgTargetAmountHint }}</span>
          </div>

          <div>
            <span class="mb-4 block text-center text-sm text-[#568996]">Als Nächstes legen Sie die Laufzeit fest.</span>
            <button
              type="button"
              :disabled="parsedAmount === null"
              class="motion-cta w-full rounded-[4px] border border-[#003745] bg-[#003745] px-4 py-3 font-medium text-white transition-colors hover:bg-[#002C36] disabled:cursor-not-allowed disabled:border-[#D5DEE1] disabled:bg-[#D5DEE1] disabled:text-[#003745]/60"
              @click="handleManualSubmit"
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
        class="relative flex flex-col overflow-hidden rounded-[4px] border border-[#003745]/20 bg-white p-8 transition-[border-color,box-shadow,transform] duration-[180ms] ease-[var(--motion-ease-standard)] hover:border-[#003745] hover:shadow-lg"
      >
        <div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#F4F9FA] text-[#003745]">
          Fx
        </div>
        <h3 class="mb-3 text-xl font-bold text-[#003745]">Betrag ermitteln</h3>
        <p class="mb-6 text-[#568996]">Wir helfen Ihnen, den passenden Betrag zu finden, basierend auf:</p>

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
          <span class="mb-4 block text-center text-sm text-[#568996]">Als Nächstes legen wir Prioritäten fest.</span>
          <button
            type="button"
            class="motion-cta w-full rounded-[4px] border border-[#003745] bg-white px-4 py-3 font-medium text-[#003745] transition-colors hover:bg-[#F4F9FA]"
            @click="handleCalculateClick"
          >
            Betrag ermitteln
          </button>
        </div>
      </article>
    </div>
  </div>
</template>
