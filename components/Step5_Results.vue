<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useWizard } from '../composables/useWizard'
import {
  calculateSavingsPlan,
  calculateTimeGainWithExtraMonthly,
} from '../domain/savingsPlan'
import { buildResultDeepLink } from '../domain/resultDeepLink'
import { runMotionLeave } from '../motion/leaveHook'
import {
  getModalBackdropVariants,
  getModalPanelVariants,
} from '../motion/presets'
import { useMotionSafety } from '../motion/useMotionSafety'
import { parseEuroInput } from '../domain/wizardValidation'
import { exportResultPdf } from '../services/resultPdf'
import { getGoal } from './goalsData'
import { formatCurrency } from './ui/utils'
import type { StrategyType } from '../stores/wizard'

const {
  targetAmount,
  setTargetAmount,
  durationYears,
  setDurationYears,
  selectedStrategy,
  setSelectedStrategy,
  customAnnualRate,
  setCustomAnnualRate,
  goal,
  customGoalName,
  setStep,
} = useWizard()

type ResultTab = 'overview' | 'optimization' | 'implementation'
type BaseStrategyType = Exclude<StrategyType, 'custom'>

const LINKS = {
  sparrechner: 'https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/vorsorge-und-sparen#Sparrechner',
  fondsfinder: 'https://www.deka.de/privatkunden/fondssuche',
  termin: 'https://www.deka.de/privatkunden/kontaktaufnahme/persoenliche-beratung',
  internetfiliale: 'https://www.sparkasse.de/',
  dkf: 'https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-fondssparplan',
  dynamisierung: 'https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-fondssparplan#Dynamisierung',
  starteinlage: 'https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-fondssparplan',
  abraeumsparen: 'https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-abraeumsparen',
}

const activeTab = ref<ResultTab>('overview')
const isExporting = ref(false)
const isCopyingLink = ref(false)
const copyFeedback = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const feedbackTimeout = ref<number | null>(null)
const targetAmountInput = ref(String(targetAmount.value))
const durationInput = ref(String(durationYears.value))
const customRatePercentInput = ref((customAnnualRate.value * 100).toFixed(1))
const isEditingTarget = ref(false)
const isEditingDuration = ref(false)
const isGoalInfoModalOpen = ref(false)

const { prefersReducedMotion } = useMotionSafety()
const modalBackdropVariants = computed(() =>
  getModalBackdropVariants(prefersReducedMotion.value),
)
const modalPanelVariants = computed(() =>
  getModalPanelVariants(prefersReducedMotion.value),
)

const STRATEGY_ORDER: BaseStrategyType[] = ['security', 'balanced', 'growth']
const STRATEGY_COPY: Record<
  BaseStrategyType,
  { option: string; title: string; risk: string }
> = {
  security: {
    option: 'Option A',
    title: 'Niedrige Rendite',
    risk: 'Geringeres Risiko',
  },
  balanced: {
    option: 'Option B',
    title: 'Mittlere Rendite',
    risk: 'Mittleres Risiko',
  },
  growth: {
    option: 'Option C',
    title: 'Höhere Rendite',
    risk: 'Höheres Risiko',
  },
}

const goalIconMap: Record<string, string> = {
  globe: '🌍',
  heart: '❤️',
  hourglass: '⏳',
  home: '🏠',
  gauge: '🚗',
  'credit-card': '🛍️',
  'piggy-bank': '🐷',
  'pen-tool': '✍️',
}

const fundFavorites = [
  { rank: 1, name: 'Deka-GlobalChampions CF', isin: 'DE000DK0ECU8', type: 'Aktienfonds' },
  { rank: 2, name: 'Deka-DividendenStrategie CF', isin: 'DE000DK2CDS0', type: 'Aktienfonds' },
  { rank: 3, name: 'Deka MSCI World UCITS ETF', isin: 'DE000ETFL508', type: 'ETF' },
  { rank: 4, name: 'Deka-MegaTrends CF', isin: 'DE0005152706', type: 'Aktienfonds' },
  { rank: 5, name: 'Deka-Industrie 4.0 CF', isin: 'LU1508359509', type: 'Aktienfonds' },
  { rank: 6, name: 'Deka-Security and Defense CF', isin: 'LU2941481082', type: 'Aktienfonds' },
  { rank: 7, name: 'Deka-ESG GlobalChampions CF', isin: 'DE000DK0V554', type: 'Aktienfonds' },
  { rank: 8, name: 'Deka-Künstliche Intelligenz CF', isin: 'LU2339791803', type: 'Aktienfonds' },
  { rank: 9, name: 'Deka MSCI World Climate Change ESG UCITS ETF', isin: 'DE000ETFL581', type: 'ETF' },
  { rank: 10, name: 'Deka-Globale Aktien LowRisk CF (A)', isin: 'LU0851806900', type: 'Aktienfonds' },
]

const currentGoal = computed(() => getGoal(goal.value))
const goalLabel = computed(() => {
  if (goal.value === 'custom') {
    return customGoalName.value || 'Ihr Ziel'
  }

  return currentGoal.value.label
})
const goalEmoji = computed(() => {
  if (!currentGoal.value.icon) {
    return '🎯'
  }

  return goalIconMap[currentGoal.value.icon] || '🎯'
})

const strategyCards = computed(() => {
  return STRATEGY_ORDER.map((key) => {
    const strategy = currentGoal.value.strategies[key]
    return {
      key,
      option: STRATEGY_COPY[key].option,
      title: STRATEGY_COPY[key].title,
      risk: STRATEGY_COPY[key].risk,
      rate: strategy.rate,
    }
  })
})

const selectedAnnualRate = computed(() => {
  if (selectedStrategy.value === 'custom') {
    return customAnnualRate.value
  }

  return currentGoal.value.strategies[selectedStrategy.value as BaseStrategyType].rate
})

const projection = computed(() => {
  return calculateSavingsPlan({
    targetAmount: targetAmount.value,
    durationYears: durationYears.value,
    annualRate: selectedAnnualRate.value,
  })
})

const monthlySavings = computed(() => projection.value.monthlySavings)
const totalInvested = computed(() => projection.value.totalInvested)
const totalReturn = computed(() => projection.value.totalReturn)
const zeroReturnMonthly = computed(() => projection.value.zeroReturnMonthly)
const monthlyDifference = computed(() => projection.value.monthlyDifference)
const targetYear = computed(() => projection.value.targetYear)
const zeroReturnInvested = computed(() => zeroReturnMonthly.value * durationYears.value * 12)

const optimizationTimeGain = computed(() => {
  return calculateTimeGainWithExtraMonthly({
    targetAmount: targetAmount.value,
    baseMonthlySavings: monthlySavings.value,
    extraMonthlySavings: 20,
    annualRate: selectedAnnualRate.value,
  })
})

const optimizationTimeGainLabel = computed(() => {
  if (!optimizationTimeGain.value || optimizationTimeGain.value.monthsEarlier <= 0) {
    return 'Kein zusätzlicher Zeitgewinn im aktuellen Szenario.'
  }

  const monthsEarlier = optimizationTimeGain.value.monthsEarlier
  const years = Math.floor(monthsEarlier / 12)
  const months = monthsEarlier % 12

  if (years > 0 && months > 0) {
    return `${years} Jahr${years > 1 ? 'e' : ''} und ${months} Monat${months > 1 ? 'e' : ''} früher am Ziel`
  }

  if (years > 0) {
    return `${years} Jahr${years > 1 ? 'e' : ''} früher am Ziel`
  }

  return `${months} Monat${months > 1 ? 'e' : ''} früher am Ziel`
})

const tabItems: Array<{ key: ResultTab; label: string }> = [
  { key: 'overview', label: 'Übersicht' },
  { key: 'optimization', label: 'Optimierung' },
  { key: 'implementation', label: 'Umsetzung' },
]

const formatPercent = (value: number) => `${(value * 100).toFixed(1).replace('.', ',')} % p. a.`

const clearCopyFeedback = () => {
  if (feedbackTimeout.value !== null && import.meta.client) {
    window.clearTimeout(feedbackTimeout.value)
  }

  feedbackTimeout.value = null
  copyFeedback.value = null
}

const setCopyFeedback = (feedback: { type: 'success' | 'error'; text: string }) => {
  clearCopyFeedback()
  copyFeedback.value = feedback

  if (!import.meta.client) {
    return
  }

  feedbackTimeout.value = window.setTimeout(() => {
    copyFeedback.value = null
    feedbackTimeout.value = null
  }, 3200)
}

const applyTargetAmountInput = () => {
  const parsed = parseEuroInput(targetAmountInput.value)
  if (parsed === null) {
    targetAmountInput.value = String(targetAmount.value)
    return
  }

  setTargetAmount(parsed)
  targetAmountInput.value = String(parsed)
}

const applyDurationInput = () => {
  const parsed = Number(durationInput.value)
  if (!Number.isFinite(parsed)) {
    durationInput.value = String(durationYears.value)
    return
  }

  setDurationYears(Math.round(parsed))
  durationInput.value = String(durationYears.value)
}

const applyCustomRateInput = () => {
  const parsed = Number(customRatePercentInput.value.replace(',', '.'))
  if (!Number.isFinite(parsed)) {
    customRatePercentInput.value = (customAnnualRate.value * 100).toFixed(1)
    return
  }

  const normalized = Math.min(15, Math.max(0, parsed))
  setCustomAnnualRate(normalized / 100)
  customRatePercentInput.value = normalized.toFixed(1)
  setSelectedStrategy('custom')
}

const saveTargetEdit = () => {
  applyTargetAmountInput()
  isEditingTarget.value = false
}

const saveDurationEdit = () => {
  applyDurationInput()
  isEditingDuration.value = false
}

const goBack = () => {
  setStep(4)
}

const getResultDeepLink = (): string | null => {
  if (!import.meta.client) {
    return null
  }

  const baseUrl = `${window.location.origin}${window.location.pathname}`
  return buildResultDeepLink(baseUrl, {
    goal: goal.value,
    target: targetAmount.value,
    years: durationYears.value,
    strategy: selectedStrategy.value,
    rate: selectedAnnualRate.value,
  })
}

const handleCopyLink = async () => {
  if (!import.meta.client || isCopyingLink.value) {
    return
  }

  isCopyingLink.value = true
  try {
    const shareUrl = getResultDeepLink()
    if (!shareUrl) {
      throw new Error('Link generation unavailable')
    }

    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      throw new Error('Clipboard API unavailable')
    }

    await navigator.clipboard.writeText(shareUrl)
    setCopyFeedback({
      type: 'success',
      text: 'Link wurde in die Zwischenablage kopiert.',
    })
  } catch (error) {
    console.error('Copy link failed:', error)
    setCopyFeedback({
      type: 'error',
      text: 'Link konnte nicht kopiert werden. Bitte erneut versuchen.',
    })
  } finally {
    isCopyingLink.value = false
  }
}

const handleExportPdf = async () => {
  if (isExporting.value) {
    return
  }

  isExporting.value = true

  try {
    if (!import.meta.client) {
      return
    }

    const resultDeepLink = getResultDeepLink()
    if (!resultDeepLink) {
      throw new Error('Link generation unavailable')
    }

    await exportResultPdf({
      goalLabel: goalLabel.value,
      durationYears: durationYears.value,
      targetYear: targetYear.value,
      targetAmount: targetAmount.value,
      monthlySavings: monthlySavings.value,
      annualRate: selectedAnnualRate.value,
      totalInvested: totalInvested.value,
      totalReturn: totalReturn.value,
      generatedAt: new Date(),
      resultDeepLink,
    })
  } catch (error) {
    console.error('PDF export failed:', error)
    window.alert('PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.')
  } finally {
    isExporting.value = false
  }
}

watch(targetAmount, (nextValue) => {
  targetAmountInput.value = String(nextValue)
})

watch(durationYears, (nextValue) => {
  durationInput.value = String(nextValue)
})

watch(customAnnualRate, (nextValue) => {
  customRatePercentInput.value = (nextValue * 100).toFixed(1)
})

onBeforeUnmount(() => {
  clearCopyFeedback()
})
</script>

<template>
  <div class="min-h-screen bg-white pb-16">
    <div class="border-b border-[#003745]/10 bg-[#F4F9FA] px-4 pb-12 pt-8">
      <div class="relative mx-auto max-w-6xl">
        <button
          type="button"
          class="absolute left-0 top-0 flex items-center gap-2 text-sm font-medium text-[#568996] transition-colors hover:text-[#003745]"
          @click="goBack"
        >
          Zurück
        </button>

        <div class="mb-8 flex flex-col items-center pt-8 text-center">
          <span class="mb-3 block text-sm font-medium uppercase tracking-widest text-[#EE0000]">Schritt 5 von 5</span>
          <h1 class="mb-4 text-4xl font-bold tracking-tight text-[#003745] md:text-5xl">Ihre Weltreise wird greifbar.</h1>
          <p class="max-w-3xl text-lg text-[#568996] md:text-xl">
            Mit Ihrem Plan sparen Sie
            <span class="font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</span>
            in
            <span class="font-semibold text-[#003745]">{{ durationYears }} Jahren</span>.
          </p>
        </div>

        <div class="mb-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            :disabled="isExporting"
            class="motion-cta rounded-[4px] border border-[#003745] bg-[#003745] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#002C36] disabled:cursor-not-allowed disabled:border-[#9FB6BC] disabled:bg-[#9FB6BC]"
            @click="handleExportPdf"
          >
            {{ isExporting ? 'Erzeuge PDF...' : 'Als PDF herunterladen' }}
          </button>
          <button
            type="button"
            :disabled="isCopyingLink"
            class="motion-cta rounded-[4px] border border-[#003745]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#003745] transition-colors hover:bg-[#EAF4F6] disabled:cursor-not-allowed disabled:text-[#9FB6BC]"
            @click="handleCopyLink"
          >
            {{ isCopyingLink ? 'Kopiere Link...' : 'Link kopieren' }}
          </button>
        </div>

        <p
          v-if="copyFeedback"
          class="mb-8 text-center text-sm"
          :class="copyFeedback.type === 'success' ? 'text-[#277A6B]' : 'text-[#AD1111]'"
        >
          {{ copyFeedback.text }}
        </p>

        <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section class="space-y-5 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-6">
            <article class="rounded-[4px] bg-[#003745] p-6 text-white">
              <div class="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9FB6BC]">Monatliche Sparrate</div>
              <div class="text-4xl font-bold tracking-tight">{{ formatCurrency(monthlySavings) }}</div>
              <div class="mt-2 text-sm text-[#C8D8DC]">Errechnet für {{ durationYears }} Jahre</div>
            </article>

            <div class="grid gap-4 md:grid-cols-2">
              <button
                v-for="strategyCard in strategyCards"
                :key="strategyCard.key"
                type="button"
                class="rounded-[4px] p-4 text-left transition-colors"
                :class="
                  selectedStrategy === strategyCard.key
                    ? 'border-2 border-[#003745] bg-[#003745]/10'
                    : 'border border-[#003745]/15 bg-white hover:border-[#003745]/45'
                "
                @click="setSelectedStrategy(strategyCard.key)"
              >
                <div class="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#568996]">{{ strategyCard.option }}</div>
                <h3 class="text-base font-semibold text-[#003745]">{{ strategyCard.title }}</h3>
                <p class="mt-1 text-xl font-bold text-[#003745]">{{ formatPercent(strategyCard.rate) }}</p>
                <p class="mt-2 text-sm text-[#568996]">{{ strategyCard.risk }}</p>
              </button>

              <div
                class="rounded-[4px] p-4"
                :class="
                  selectedStrategy === 'custom'
                    ? 'border-2 border-[#003745] bg-[#003745]/10'
                    : 'border border-[#003745]/15 bg-white'
                "
              >
                <button
                  type="button"
                  class="w-full text-left"
                  @click="setSelectedStrategy('custom')"
                >
                  <div class="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#568996]">Option D</div>
                  <h3 class="text-base font-semibold text-[#003745]">Individuelle Rendite</h3>
                </button>
                <div class="mt-3 flex items-center gap-2">
                  <input
                    v-model="customRatePercentInput"
                    type="number"
                    min="0"
                    max="15"
                    step="0.1"
                    class="h-10 w-full rounded-[4px] border border-[#003745]/20 px-3 text-sm text-[#003745] outline-none focus:border-[#003745] focus:ring-1 focus:ring-[#003745]"
                    @focus="setSelectedStrategy('custom')"
                    @blur="applyCustomRateInput"
                  />
                  <button
                    type="button"
                    class="h-10 rounded-[4px] border border-[#003745] px-3 text-sm font-medium text-[#003745] hover:bg-[#EAF4F6]"
                    @click="applyCustomRateInput"
                  >
                    OK
                  </button>
                </div>
                <p class="mt-2 text-xs text-[#568996]">Wert zwischen 0,0 % und 15,0 % p. a.</p>
              </div>
            </div>
          </section>

          <aside class="rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-6">
            <div class="mb-5 flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-[#568996]">Sparziel-Steckbrief</p>
                <h2 class="mt-2 text-2xl font-bold text-[#003745]">{{ goalLabel }}</h2>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-2xl">
                {{ goalEmoji }}
              </div>
            </div>

            <div class="space-y-4">
              <div class="rounded-[4px] border border-[#E0EBEE] bg-[#F9FCFD] p-4">
                <div class="mb-1 text-xs uppercase tracking-wider text-[#568996]">Zielbetrag</div>
                <div v-if="!isEditingTarget" class="flex items-center justify-between gap-3">
                  <div class="text-xl font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</div>
                  <button
                    type="button"
                    class="rounded-[4px] border border-[#003745]/20 px-3 py-1.5 text-xs font-medium text-[#003745] hover:bg-white"
                    @click="isEditingTarget = true"
                  >
                    Bearbeiten
                  </button>
                </div>
                <div v-else class="space-y-2">
                  <input
                    v-model="targetAmountInput"
                    type="text"
                    inputmode="numeric"
                    class="h-10 w-full rounded-[4px] border border-[#003745]/20 px-3 text-sm text-[#003745] outline-none focus:border-[#003745] focus:ring-1 focus:ring-[#003745]"
                  />
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="rounded-[4px] border border-[#003745] px-3 py-1.5 text-xs font-medium text-[#003745] hover:bg-white"
                      @click="saveTargetEdit"
                    >
                      Speichern
                    </button>
                    <button
                      type="button"
                      class="rounded-[4px] border border-[#003745]/20 px-3 py-1.5 text-xs font-medium text-[#568996] hover:bg-white"
                      @click="isEditingTarget = false"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>

              <div class="rounded-[4px] border border-[#E0EBEE] bg-[#F9FCFD] p-4">
                <div class="mb-1 text-xs uppercase tracking-wider text-[#568996]">Laufzeit</div>
                <div v-if="!isEditingDuration" class="flex items-center justify-between gap-3">
                  <div>
                    <div class="text-xl font-semibold text-[#003745]">{{ durationYears }} Jahre</div>
                    <div class="text-sm text-[#568996]">Zieljahr {{ targetYear }}</div>
                  </div>
                  <button
                    type="button"
                    class="rounded-[4px] border border-[#003745]/20 px-3 py-1.5 text-xs font-medium text-[#003745] hover:bg-white"
                    @click="isEditingDuration = true"
                  >
                    Bearbeiten
                  </button>
                </div>
                <div v-else class="space-y-2">
                  <input
                    v-model="durationInput"
                    type="number"
                    min="1"
                    max="40"
                    step="1"
                    class="h-10 w-full rounded-[4px] border border-[#003745]/20 px-3 text-sm text-[#003745] outline-none focus:border-[#003745] focus:ring-1 focus:ring-[#003745]"
                  />
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="rounded-[4px] border border-[#003745] px-3 py-1.5 text-xs font-medium text-[#003745] hover:bg-white"
                      @click="saveDurationEdit"
                    >
                      Speichern
                    </button>
                    <button
                      type="button"
                      class="rounded-[4px] border border-[#003745]/20 px-3 py-1.5 text-xs font-medium text-[#568996] hover:bg-white"
                      @click="isEditingDuration = false"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="mt-5 text-sm font-medium text-[#003745] underline-offset-2 hover:underline"
              @click="isGoalInfoModalOpen = true"
            >
              Wie setzt sich der Zielbetrag zusammen?
            </button>
          </aside>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-8 max-w-6xl px-4">
      <nav class="mb-6 grid grid-cols-3 gap-2 rounded-[4px] border border-[#003745]/10 bg-[#F8FBFC] p-1">
        <button
          v-for="tab in tabItems"
          :key="tab.key"
          type="button"
          class="rounded-[4px] px-4 py-2.5 text-sm font-semibold transition-colors"
          :class="
            activeTab === tab.key
              ? 'bg-[#003745] text-white'
              : 'text-[#003745] hover:bg-white'
          "
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </nav>

      <section v-if="activeTab === 'overview'" class="space-y-6 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-8">
        <div>
          <h2 class="text-2xl font-bold text-[#003745]">Warum Wertpapiersparen sinnvoll ist</h2>
          <p class="mt-2 text-sm text-[#568996]">
            Mit Renditeannahmen kann Ihr Ziel bei gleicher Laufzeit mit einer geringeren monatlichen Sparrate erreicht werden.
          </p>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <article class="rounded-[4px] border border-[#003745]/20 bg-[#003745]/5 p-5">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-[#003745]">Mit DKF Sparplan</h3>
              <span class="rounded-full bg-[#003745] px-3 py-1 text-xs font-semibold text-white">Aktive Annahme</span>
            </div>
            <div class="mb-4 flex items-end justify-between">
              <div>
                <div class="text-xs uppercase tracking-wide text-[#568996]">Monatliche Sparrate</div>
                <div class="text-3xl font-bold text-[#003745]">{{ formatCurrency(monthlySavings) }}</div>
              </div>
              <span class="rounded-[4px] bg-[#277A6B]/10 px-3 py-1 text-sm font-semibold text-[#277A6B]">
                {{ monthlyDifference > 0 ? '-' : '' }}{{ formatCurrency(Math.abs(monthlyDifference)) }} / Monat
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between"><span class="text-[#568996]">Ziel erreicht</span><span class="font-semibold text-[#003745]">in {{ durationYears }} Jahren ({{ targetYear }})</span></div>
              <div class="flex items-center justify-between"><span class="text-[#568996]">Angespartes Kapital</span><span class="font-semibold text-[#003745]">{{ formatCurrency(totalInvested) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[#568996]">Voraussichtlicher Endwert</span><span class="font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[#568996]">Davon Erträge</span><span class="font-semibold text-[#277A6B]">+{{ formatCurrency(totalReturn) }}</span></div>
            </div>
            <a
              :href="LINKS.dkf"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-block text-sm font-medium text-[#003745] underline-offset-2 hover:underline"
            >
              Mehr zum DKF-Sparplan erfahren
            </a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 bg-white p-5">
            <h3 class="mb-4 text-lg font-semibold text-[#003745]">Ohne Rendite</h3>
            <div class="mb-4">
              <div class="text-xs uppercase tracking-wide text-[#568996]">Monatliche Sparrate</div>
              <div class="text-3xl font-bold text-[#003745]">{{ formatCurrency(zeroReturnMonthly) }}</div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between"><span class="text-[#568996]">Ziel erreicht</span><span class="font-semibold text-[#003745]">in {{ durationYears }} Jahren ({{ targetYear }})</span></div>
              <div class="flex items-center justify-between"><span class="text-[#568996]">Angespartes Kapital</span><span class="font-semibold text-[#003745]">{{ formatCurrency(zeroReturnInvested) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[#568996]">Voraussichtlicher Endwert</span><span class="font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[#568996]">Davon Erträge</span><span class="font-semibold text-[#003745]">0 €</span></div>
            </div>
          </article>
        </div>
      </section>

      <section v-else-if="activeTab === 'optimization'" class="space-y-6 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-8">
        <h2 class="text-2xl font-bold text-[#003745]">Optimierung</h2>

        <div class="grid gap-4 md:grid-cols-2">
          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <p class="mb-2 text-sm font-semibold text-[#003745]">Dynamisierung</p>
            <h3 class="text-lg font-semibold text-[#003745]">Inflation ausgleichen</h3>
            <p class="mt-1 text-[#568996]">+2 % p. a.</p>
            <a :href="LINKS.dynamisierung" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block text-sm font-medium text-[#003745] underline-offset-2 hover:underline">Mehr erfahren</a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <p class="mb-2 text-sm font-semibold text-[#003745]">Starteinlage</p>
            <h3 class="text-lg font-semibold text-[#003745]">Einmaliger Boost zum Start</h3>
            <p class="mt-1 text-[#568996]">+1.000 € einmalig</p>
            <a :href="LINKS.starteinlage" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block text-sm font-medium text-[#003745] underline-offset-2 hover:underline">Mehr erfahren</a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <p class="mb-2 text-sm font-semibold text-[#003745]">DK-Abräumsparen</p>
            <h3 class="text-lg font-semibold text-[#003745]">Überschüsse automatisch sparen</h3>
            <p class="mt-1 text-[#568996]">+80 € monatlich</p>
            <a :href="LINKS.abraeumsparen" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block text-sm font-medium text-[#003745] underline-offset-2 hover:underline">Mehr erfahren</a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <p class="mb-2 text-sm font-semibold text-[#003745]">Höhere Sparrate</p>
            <h3 class="text-lg font-semibold text-[#003745]">Schneller ans Ziel</h3>
            <p class="mt-1 text-[#568996]">+20 € monatlich</p>
            <p class="mt-4 text-sm font-semibold text-[#277A6B]">{{ optimizationTimeGainLabel }}</p>
          </article>
        </div>

        <a
          :href="LINKS.sparrechner"
          target="_blank"
          rel="noopener noreferrer"
          class="motion-cta inline-flex rounded-[4px] border border-[#003745] bg-[#003745] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002C36]"
        >
          Zum Sparrechner
        </a>
      </section>

      <section v-else class="space-y-6 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-8">
        <article class="rounded-[4px] border border-[#D3DEE3] bg-[#EEF3F6] p-6 md:p-8">
          <div class="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-sm font-bold uppercase tracking-widest text-[#EE0000]">Kundenfavoriten</p>
              <h2 class="mt-2 text-4xl font-bold tracking-tight text-[#003745] md:text-5xl">Die Sparplan-Favoriten.</h2>
            </div>
            <a
              :href="LINKS.fondsfinder"
              target="_blank"
              rel="noopener noreferrer"
              class="motion-cta rounded-[4px] bg-[#315EB7] px-6 py-3 text-base font-medium text-white hover:bg-[#274E9B]"
            >
              Zum Fondsfinder
            </a>
          </div>

          <p class="mb-4 max-w-4xl text-lg text-[#1B4A5A]">
            Nachfolgend zeigen wir Ihnen die Fonds, die von unseren Kunden im letzten Monat am häufigsten für Fondssparpläne im DekaBank Depot ausgewählt wurden.
          </p>

          <div class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th class="border-b border-[#C6D5DD] px-4 py-3 font-semibold text-[#0F4457]">Rang</th>
                  <th class="border-b border-[#C6D5DD] px-4 py-3 font-semibold text-[#0F4457]">Name</th>
                  <th class="border-b border-[#C6D5DD] px-4 py-3 font-semibold text-[#0F4457]">ISIN</th>
                  <th class="border-b border-[#C6D5DD] px-4 py-3 font-semibold text-[#0F4457]">Fondstyp</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fund in fundFavorites" :key="fund.rank">
                  <td class="border-b border-[#D9E4EA] px-4 py-3 text-[#1B4A5A]">{{ fund.rank }}</td>
                  <td class="border-b border-[#D9E4EA] px-4 py-3 text-[#1B4A5A]">{{ fund.name }}</td>
                  <td class="border-b border-[#D9E4EA] px-4 py-3 text-[#1B4A5A]">{{ fund.isin }}</td>
                  <td class="border-b border-[#D9E4EA] px-4 py-3 text-[#1B4A5A]">{{ fund.type }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article>
          <h3 class="mb-4 text-2xl font-bold text-[#003745]">Weitere Schritte</h3>
          <div class="grid gap-4 md:grid-cols-3">
            <section class="rounded-[4px] border border-[#003745]/15 p-5">
              <h4 class="text-lg font-semibold text-[#003745]">Abschluss in der Filiale</h4>
              <p class="mt-2 text-sm text-[#4F7280]">Sie möchten persönlich beraten werden. Nehmen Sie Ihren Sparplan einfach mit in die Filiale. Eine Beraterin oder ein Berater prüft Ihren Plan gemeinsam mit Ihnen und schließt ihn direkt vor Ort ab.</p>
              <p class="mt-3 text-sm font-semibold text-[#003745]">So geht's</p>
              <ol class="mt-2 space-y-1 text-sm text-[#4F7280]">
                <li>1. Sparplan speichern oder ausdrucken.</li>
                <li>2. <a :href="LINKS.termin" target="_blank" rel="noopener noreferrer" class="font-medium text-[#003745] underline-offset-2 hover:underline">Termin in Ihrer Sparkassenfiliale vereinbaren.</a></li>
                <li>3. Persönlich besprechen und abschließen.</li>
              </ol>
            </section>

            <section class="rounded-[4px] border border-[#003745]/15 p-5">
              <h4 class="text-lg font-semibold text-[#003745]">Abschluss in der Internetfiliale</h4>
              <p class="mt-2 text-sm text-[#4F7280]">Sie möchten Ihren Sparplan direkt digital umsetzen. Öffnen Sie die Internetfiliale, übernehmen Sie Ihre Eckdaten und schließen Sie den Auftrag online ab.</p>
              <p class="mt-3 text-sm font-semibold text-[#003745]">So geht's</p>
              <ol class="mt-2 space-y-1 text-sm text-[#4F7280]">
                <li>1. Sparplan-Daten bereithalten.</li>
                <li>2. <a :href="LINKS.internetfiliale" target="_blank" rel="noopener noreferrer" class="font-medium text-[#003745] underline-offset-2 hover:underline">Internetfiliale öffnen.</a></li>
                <li>3. Auftrag online prüfen und absenden.</li>
              </ol>
            </section>

            <section class="rounded-[4px] border border-[#003745]/15 p-5">
              <h4 class="text-lg font-semibold text-[#003745]">Abschluss in der S-Invest App</h4>
              <p class="mt-2 text-sm text-[#4F7280]">Sie nutzen die S-Invest App. Übertragen Sie Ihre Sparplan-Werte aus dieser Seite und schließen Sie den Plan direkt in der App ab.</p>
              <p class="mt-3 text-sm font-semibold text-[#003745]">So geht's</p>
              <ol class="mt-2 space-y-1 text-sm text-[#4F7280]">
                <li>1. Sparplan-Werte notieren oder als PDF speichern.</li>
                <li>2. S-Invest App öffnen und Sparplan anlegen.</li>
                <li>3. Daten übernehmen und Abschluss durchführen.</li>
              </ol>
              <p class="mt-3 text-xs font-medium text-[#568996]">Aktuell ist kein Direktlink zur S-Invest App hinterlegt.</p>
            </section>
          </div>
        </article>
      </section>
    </div>

    <div class="pointer-events-none fixed inset-0 z-[120]">
      <Transition :css="false" @leave="runMotionLeave">
        <button
          v-if="isGoalInfoModalOpen"
          v-motion
          :initial="modalBackdropVariants.initial"
          :enter="modalBackdropVariants.enter"
          :leave="modalBackdropVariants.leave"
          aria-label="Modal schließen"
          class="pointer-events-auto absolute inset-0 bg-[#003745]/45 backdrop-blur-[1px]"
          @click="isGoalInfoModalOpen = false"
        />
      </Transition>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <Transition :css="false" @leave="runMotionLeave">
          <div
            v-if="isGoalInfoModalOpen"
            v-motion
            :initial="modalPanelVariants.initial"
            :enter="modalPanelVariants.enter"
            :leave="modalPanelVariants.leave"
            role="dialog"
            aria-modal="true"
            aria-label="Info Zielbetrag"
            class="pointer-events-auto relative w-full max-w-xl space-y-4 rounded-[4px] border border-[#D8E5E8] bg-[#F4F9FA] p-5 shadow-xl sm:p-6"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-lg font-bold text-[#003745]">Wie setzt sich der Zielbetrag zusammen?</h3>
              <button
                type="button"
                class="rounded-[4px] border border-[#003745]/20 px-2 py-1 text-sm text-[#003745] hover:bg-white"
                @click="isGoalInfoModalOpen = false"
              >
                Schließen
              </button>
            </div>
            <p class="text-sm text-[#4F7280]">
              Der Zielbetrag basiert auf Ihrem ausgewählten Sparziel und Ihren Eingaben. Sie können Zielbetrag und Laufzeit jederzeit bearbeiten. Die monatliche Sparrate wird danach automatisch neu berechnet.
            </p>
          </div>
        </Transition>
      </div>
    </div>

  </div>
</template>
