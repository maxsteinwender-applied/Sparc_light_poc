<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
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
  dekaFondssparplan: 'https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-fondssparplan',
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
const formatRatePercentInput = (annualRate: number) => (annualRate * 100).toFixed(1).replace('.', ',')
const customRatePercentInput = ref(formatRatePercentInput(customAnnualRate.value))
const isEditingTarget = ref(false)
const isEditingDuration = ref(false)
const isGoalInfoModalOpen = ref(false)
const goalInfoTriggerRef = ref<HTMLButtonElement | null>(null)
const modalPanelRef = ref<HTMLElement | null>(null)
const modalTitleId = 'goal-info-modal-title'
const modalFocusOrigin = ref<HTMLElement | null>(null)

const { prefersReducedMotion } = useMotionSafety()
const modalBackdropVariants = computed(() =>
  getModalBackdropVariants(prefersReducedMotion.value),
)
const modalPanelVariants = computed(() =>
  getModalPanelVariants(prefersReducedMotion.value),
)
const FALLBACK_PRESET_STRATEGY: BaseStrategyType = 'balanced'
const lastPresetStrategy = ref<BaseStrategyType>(
  selectedStrategy.value === 'custom'
    ? FALLBACK_PRESET_STRATEGY
    : (selectedStrategy.value as BaseStrategyType),
)

const STRATEGY_ORDER: BaseStrategyType[] = ['security', 'balanced', 'growth']
const STRATEGY_COPY: Record<
  BaseStrategyType,
  { option: string; title: string; risk: string; icon: string }
> = {
  security: {
    option: 'Variante A',
    title: 'Sicherheitsorientiert',
    risk: 'Geringeres Risiko',
    icon: 'shield',
  },
  balanced: {
    option: 'Variante B',
    title: 'Ausgewogen',
    risk: 'Mittleres Risiko',
    icon: 'balance',
  },
  growth: {
    option: 'Variante C',
    title: 'Wachstumsorientiert',
    risk: 'Höheres Risiko',
    icon: 'trending_up',
  },
}

const goalSymbolMap: Record<string, string> = {
  globe: 'travel_explore',
  heart: 'favorite',
  hourglass: 'schedule',
  home: 'home',
  gauge: 'directions_car',
  'credit-card': 'shopping_cart',
  'piggy-bank': 'savings',
  'pen-tool': 'edit',
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
const goalSymbol = computed(() => {
  if (!currentGoal.value.icon) {
    return 'flag'
  }

  return goalSymbolMap[currentGoal.value.icon] || 'flag'
})

const strategyCards = computed(() => {
  return STRATEGY_ORDER.map((key) => {
    const strategy = currentGoal.value.strategies[key]
    return {
      key,
      option: STRATEGY_COPY[key].option,
      title: STRATEGY_COPY[key].title,
      risk: STRATEGY_COPY[key].risk,
      icon: STRATEGY_COPY[key].icon,
      rate: strategy.rate,
    }
  })
})

const isCustomRateEnabled = computed(() => selectedStrategy.value === 'custom')

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

const tabItems: Array<{ key: ResultTab; label: string; icon: string; disabled?: boolean }> = [
  { key: 'overview', label: 'Übersicht', icon: 'dashboard' },
  { key: 'optimization', label: 'Optimierung', icon: 'tune' },
  { key: 'implementation', label: 'Umsetzung', icon: 'task_alt' },
]

const tabRefs = ref<Array<HTMLButtonElement | null>>([])
const focusedTab = ref<ResultTab>(activeTab.value)

const setTabRef = (element: Element | ComponentPublicInstance | null, index: number) => {
  const resolvedElement =
    element && '$el' in element ? (element.$el as Element | null) : element
  tabRefs.value[index] = resolvedElement instanceof HTMLButtonElement ? resolvedElement : null
}

const setGoalInfoTriggerRef = (element: Element | ComponentPublicInstance | null) => {
  const resolvedElement =
    element && '$el' in element ? (element.$el as Element | null) : element
  goalInfoTriggerRef.value = resolvedElement instanceof HTMLButtonElement ? resolvedElement : null
}

const getTabIndex = (key: ResultTab) => tabItems.findIndex((tab) => tab.key === key)

const focusTabByIndex = (index: number) => {
  const tab = tabItems[index]
  if (!tab || tab.disabled) {
    return
  }

  focusedTab.value = tab.key
  nextTick(() => {
    tabRefs.value[index]?.focus()
  })
}

const focusAdjacentTab = (startIndex: number, direction: -1 | 1) => {
  const totalTabs = tabItems.length
  if (!totalTabs) {
    return
  }

  let cursor = startIndex
  for (let attempt = 0; attempt < totalTabs; attempt += 1) {
    cursor = (cursor + direction + totalTabs) % totalTabs
    if (!tabItems[cursor].disabled) {
      focusTabByIndex(cursor)
      return
    }
  }
}

const scrollTabIntoView = (key: ResultTab) => {
  if (!import.meta.client) {
    return
  }

  const index = getTabIndex(key)
  if (index < 0) {
    return
  }

  tabRefs.value[index]?.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
    behavior: 'auto',
  })
}

const activateTab = (key: ResultTab) => {
  const index = getTabIndex(key)
  if (index < 0 || tabItems[index].disabled) {
    return
  }

  activeTab.value = key
  focusedTab.value = key
}

const handleTabKeydown = (event: KeyboardEvent, index: number, key: ResultTab) => {
  if (tabItems[index]?.disabled) {
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusAdjacentTab(index, 1)
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusAdjacentTab(index, -1)
    return
  }

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault()
    activateTab(key)
  }
}

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
  if (!isCustomRateEnabled.value) {
    return
  }

  const parsed = Number(customRatePercentInput.value.replace(',', '.'))
  if (!Number.isFinite(parsed)) {
    customRatePercentInput.value = formatRatePercentInput(customAnnualRate.value)
    return
  }

  const normalized = Math.min(15, Math.max(0, parsed))
  setCustomAnnualRate(normalized / 100)
  customRatePercentInput.value = formatRatePercentInput(normalized / 100)
  setSelectedStrategy('custom')
}

const selectPresetStrategy = (strategy: BaseStrategyType) => {
  lastPresetStrategy.value = strategy
  setSelectedStrategy(strategy)
}

const toggleCustomRate = () => {
  if (isCustomRateEnabled.value) {
    setSelectedStrategy(lastPresetStrategy.value)
    return
  }

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

const closeGoalInfoModal = () => {
  isGoalInfoModalOpen.value = false
}

const getModalFocusableElements = () => {
  const panel = modalPanelRef.value
  if (!panel) {
    return []
  }

  const selectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(panel.querySelectorAll<HTMLElement>(selectors)).filter((node) => {
    if (node.getAttribute('aria-hidden') === 'true') {
      return false
    }

    return node.offsetParent !== null || node === document.activeElement
  })
}

const handleModalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeGoalInfoModal()
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const focusableElements = getModalFocusableElements()
  if (focusableElements.length === 0) {
    event.preventDefault()
    modalPanelRef.value?.focus()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  const activeElement = document.activeElement as HTMLElement | null

  if (event.shiftKey) {
    if (!activeElement || activeElement === firstElement || !modalPanelRef.value?.contains(activeElement)) {
      event.preventDefault()
      lastElement.focus()
    }
    return
  }

  if (!activeElement || activeElement === lastElement || !modalPanelRef.value?.contains(activeElement)) {
    event.preventDefault()
    firstElement.focus()
  }
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
  customRatePercentInput.value = formatRatePercentInput(nextValue)
})

watch(selectedStrategy, (nextValue) => {
  if (nextValue !== 'custom') {
    lastPresetStrategy.value = nextValue as BaseStrategyType
  }
})

watch(activeTab, (nextValue) => {
  focusedTab.value = nextValue
  nextTick(() => {
    scrollTabIntoView(nextValue)
  })
})

watch(isGoalInfoModalOpen, (isOpen) => {
  if (!import.meta.client) {
    return
  }

  if (isOpen) {
    modalFocusOrigin.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
    nextTick(() => {
      const focusableElements = getModalFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
        return
      }

      modalPanelRef.value?.focus()
    })
    return
  }

  nextTick(() => {
    if (goalInfoTriggerRef.value) {
      goalInfoTriggerRef.value.focus()
    } else {
      modalFocusOrigin.value?.focus()
    }
    modalFocusOrigin.value = null
  })
})

onMounted(() => {
  nextTick(() => {
    scrollTabIntoView(activeTab.value)
  })
})

onBeforeUnmount(() => {
  clearCopyFeedback()
})
</script>

<template>
  <div class="min-h-screen bg-white pb-16">
    <div class="border-b border-[#003745]/10 bg-[#F4F9FA] px-4 pb-[72px] pt-12">
      <div class="mx-auto max-w-[1160px]">
        <div class="mb-6">
          <button
            type="button"
            class="ui-text-secondary inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#003745]"
            @click="goBack"
          >
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück
          </button>
        </div>

        <div class="flex flex-col items-center text-center">
          <span class="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-[#EE0000]">Schritt 5 von 5</span>
          <h1 class="mb-4 text-4xl font-bold tracking-tight text-[#003745] md:text-5xl">Ihre Weltreise wird greifbar.</h1>
          <p class="ui-text-secondary max-w-3xl text-lg md:text-xl">
            Mit Ihrem Plan sparen Sie
            <span class="font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</span>
            in
            <span class="font-semibold text-[#003745]">{{ durationYears }} Jahren</span>.
          </p>
        </div>

        <div class="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            :disabled="isExporting"
            :aria-busy="isExporting ? 'true' : 'false'"
            class="ui-button ui-button-primary motion-cta h-12 w-full px-5 text-sm sm:w-[220px]"
            @click="handleExportPdf"
          >
            {{ isExporting ? 'Erzeuge PDF...' : 'Als PDF herunterladen' }}
          </button>
          <button
            type="button"
            :disabled="isCopyingLink"
            :aria-busy="isCopyingLink ? 'true' : 'false'"
            class="ui-button ui-button-secondary motion-cta h-12 w-full px-5 text-sm sm:w-[220px]"
            @click="handleCopyLink"
          >
            {{ isCopyingLink ? 'Kopiere Link...' : 'Link kopieren' }}
          </button>
        </div>

        <p
          v-if="copyFeedback"
          class="mt-4 text-center text-sm"
          role="status"
          aria-live="polite"
          :class="copyFeedback.type === 'success' ? 'text-[#277A6B]' : 'text-[#AD1111]'"
        >
          {{ copyFeedback.text }}
        </p>

        <div class="mt-10 grid items-start gap-7 lg:grid-cols-[1.2fr_1fr]">
          <section class="space-y-5 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-6">
            <article class="rounded-[4px] bg-[var(--deka-primary-red)] p-6 text-white">
              <div class="mb-2 flex items-center justify-between gap-3">
                <div class="text-xs font-semibold uppercase tracking-widest text-white/80">Monatliche Sparrate</div>
                <span class="inline-flex h-7 items-center rounded-full border border-white/35 bg-white/15 px-3 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Errechnet
                </span>
              </div>
              <div class="text-4xl font-bold tracking-tight">{{ formatCurrency(monthlySavings) }}</div>
              <div class="mt-2 text-sm text-white/80">Errechnet für {{ durationYears }} Jahre</div>
            </article>

            <p class="ui-text-secondary text-sm">Passen Sie hier Ihre Renditeannahme für das Sparziel an:</p>

            <div class="space-y-4">
              <button
                v-for="strategyCard in strategyCards"
                :key="strategyCard.key"
                type="button"
                :aria-pressed="selectedStrategy === strategyCard.key ? 'true' : 'false'"
                class="ui-option-card block w-full p-3.5 text-left sm:p-4"
                :class="
                  selectedStrategy === strategyCard.key
                    ? 'is-selected shadow-[var(--shadow-card)]'
                    : 'hover:border-[#003745]/45'
                "
                @click="selectPresetStrategy(strategyCard.key)"
              >
                <div class="flex min-h-8 items-start justify-between gap-3">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{{ strategyCard.option }}</p>
                  <span
                    v-if="selectedStrategy === strategyCard.key"
                    class="inline-flex h-8 items-center rounded-full bg-[#0E6073] px-3 text-[13px] font-semibold leading-none text-white md:text-[14px]"
                  >
                    Aktiv
                  </span>
                </div>
                <div class="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-4">
                  <div class="flex min-w-0 items-start gap-3">
                    <span class="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#003745]/10 bg-[#F1F3F4] text-[#003745]">
                      <span class="material-symbols-outlined text-[28px]">{{ strategyCard.icon }}</span>
                    </span>
                    <div class="min-w-0">
                      <h3 class="text-base font-semibold leading-tight text-[#003745] md:text-[1.2rem]">{{ strategyCard.title }}</h3>
                      <p class="mt-1 text-xs text-[var(--text-secondary)] md:text-sm">{{ strategyCard.risk }}</p>
                    </div>
                  </div>
                  <p class="text-2xl font-bold tracking-tight text-[#003745] sm:text-right md:text-[2rem]">{{ formatPercent(strategyCard.rate) }}</p>
                </div>
              </button>

              <div class="flex items-center gap-3">
                <span class="h-px flex-1 border-t border-dashed border-[#B5C7CD]" />
                <p class="ui-text-secondary text-sm">oder:</p>
                <span class="h-px flex-1 border-t border-dashed border-[#B5C7CD]" />
              </div>

              <div
                class="ui-option-card p-4 md:p-5"
                :class="
                  isCustomRateEnabled
                    ? 'is-selected bg-[#EEF5F7]'
                    : 'bg-[#F9FCFD]'
                "
              >
                <div class="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-base font-semibold text-[#003745]">Individuelle Rendite</h3>
                  </div>
                  <label class="inline-flex items-center gap-2 text-sm font-medium text-[#003745]">
                    <input
                      :checked="isCustomRateEnabled"
                      type="checkbox"
                      class="h-4 w-4 rounded border border-[#003745]/35 text-[#003745]"
                      @change="toggleCustomRate"
                    />
                    Eigene Rendite verwenden
                  </label>
                </div>
                <div class="mt-3 flex items-center gap-2">
                  <input
                    v-model="customRatePercentInput"
                    type="text"
                    inputmode="decimal"
                    :disabled="!isCustomRateEnabled"
                    class="ui-input h-10 w-full px-3 text-sm"
                    :class="
                      isCustomRateEnabled
                        ? 'bg-white'
                        : 'text-[var(--text-muted)]'
                    "
                    @blur="applyCustomRateInput"
                  />
                  <button
                    type="button"
                    :disabled="!isCustomRateEnabled"
                    class="ui-button ui-button-solid h-10 px-3 text-sm"
                    @click="applyCustomRateInput"
                  >
                    OK
                  </button>
                </div>
                <p class="mt-2 text-xs text-[var(--text-secondary)]">Wert zwischen 0,0 % und 15,0 % p. a.</p>
              </div>
            </div>
          </section>

          <aside class="rounded-[4px] border border-[#003745]/15 bg-gradient-to-b from-white to-[#F4F9FA] p-5 shadow-[0_12px_30px_rgba(0,55,69,0.08)] md:p-6 lg:sticky lg:top-[calc(var(--app-sticky-content-offset)+0.5rem)] lg:self-start">
            <div class="mb-5 flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Sparziel</p>
                <h2 class="mt-2 text-2xl font-bold text-[#003745]">{{ goalLabel }}</h2>
                <p class="mt-3 text-sm text-[#1B4A5A]">
                  Ihr Sparziel im Überblick
                </p>
              </div>
              <div class="flex h-20 w-20 items-center justify-center rounded-full border border-[#0A4F5E] bg-[#0E6073] text-white">
                <span class="material-symbols-outlined !text-[36px] leading-none">{{ goalSymbol }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <div class="rounded-[4px] border border-[#E0EBEE] bg-white/90 p-4">
                <div class="mb-1 text-xs uppercase tracking-wider text-[var(--text-secondary)]">Zielbetrag</div>
                <div v-if="!isEditingTarget" class="flex items-center justify-between gap-3">
                  <div class="text-xl font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</div>
                  <button
                    type="button"
                    class="ui-button ui-button-secondary h-auto px-3 py-1.5 text-xs"
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
                    class="ui-input h-10 w-full px-3 text-sm"
                  />
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="ui-button ui-button-secondary h-auto px-3 py-1.5 text-xs"
                      @click="saveTargetEdit"
                    >
                      Speichern
                    </button>
                    <button
                      type="button"
                      class="ui-button ui-button-ghost ui-text-secondary h-auto px-3 py-1.5 text-xs hover:bg-white"
                      @click="isEditingTarget = false"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>

              <div class="rounded-[4px] border border-[#E0EBEE] bg-white/90 p-4">
                <div class="mb-1 text-xs uppercase tracking-wider text-[var(--text-secondary)]">Laufzeit</div>
                <div v-if="!isEditingDuration" class="flex items-center justify-between gap-3">
                  <div>
                    <div class="text-xl font-semibold text-[#003745]">{{ durationYears }} Jahre</div>
                    <div class="text-sm text-[var(--text-secondary)]">Zieljahr {{ targetYear }}</div>
                  </div>
                  <button
                    type="button"
                    class="ui-button ui-button-secondary h-auto px-3 py-1.5 text-xs"
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
                    class="ui-input h-10 w-full px-3 text-sm"
                  />
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="ui-button ui-button-secondary h-auto px-3 py-1.5 text-xs"
                      @click="saveDurationEdit"
                    >
                      Speichern
                    </button>
                    <button
                      type="button"
                      class="ui-button ui-button-ghost ui-text-secondary h-auto px-3 py-1.5 text-xs hover:bg-white"
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
              :ref="setGoalInfoTriggerRef"
              class="result-link mt-5 text-sm"
              @click="isGoalInfoModalOpen = true"
            >
              <span class="result-link-label">Wie setzt sich der Zielbetrag zusammen?</span>
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </aside>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-8 max-w-6xl px-4">
      <nav
        class="ui-tabs mb-6"
        role="tablist"
        aria-label="Ergebnis-Navigation"
      >
        <button
          v-for="(tab, index) in tabItems"
          :key="tab.key"
          type="button"
          :id="`result-tab-${tab.key}`"
          :ref="(el) => setTabRef(el, index)"
          role="tab"
          :aria-selected="activeTab === tab.key ? 'true' : 'false'"
          :aria-controls="`result-panel-${tab.key}`"
          :aria-disabled="tab.disabled ? 'true' : undefined"
          :disabled="tab.disabled"
          :tabindex="focusedTab === tab.key ? 0 : -1"
          class="ui-tab"
          :class="
            activeTab === tab.key
              ? 'is-active'
              : ''
          "
          @click="activateTab(tab.key)"
          @focus="focusedTab = tab.key"
          @keydown="handleTabKeydown($event, index, tab.key)"
        >
          <span class="ui-tab-icon-slot">
            <span
              class="material-symbols-outlined ui-tab-icon"
              aria-hidden="true"
            >
              {{ tab.icon }}
            </span>
          </span>
          <span class="whitespace-nowrap">{{ tab.label }}</span>
        </button>
      </nav>

      <section
        v-if="activeTab === 'overview'"
        id="result-panel-overview"
        role="tabpanel"
        aria-labelledby="result-tab-overview"
        class="space-y-6 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-8"
      >
        <div>
          <h2 class="text-2xl font-bold text-[#003745]">Warum Wertpapiersparen sinnvoll ist</h2>
          <p class="mt-2 text-sm text-[var(--text-secondary)]">
            Mit Renditeannahmen kann Ihr Ziel bei gleicher Laufzeit mit einer geringeren monatlichen Sparrate erreicht werden.
          </p>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <article class="rounded-[4px] border border-[#003745]/20 bg-[#003745]/5 p-5">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-[#003745]">Mit Deka-FondsSparplan</h3>
              <span class="rounded-full bg-[#003745] px-3 py-1 text-xs font-semibold text-white">Aktive Annahme</span>
            </div>
            <div class="mb-4 flex items-end justify-between">
              <div>
                <div class="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Monatliche Sparrate</div>
                <div class="text-3xl font-bold text-[#003745]">{{ formatCurrency(monthlySavings) }}</div>
              </div>
              <span class="rounded-[4px] bg-[#277A6B]/10 px-3 py-1 text-sm font-semibold text-[#277A6B]">
                {{ monthlyDifference > 0 ? '-' : '' }}{{ formatCurrency(Math.abs(monthlyDifference)) }} / Monat
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Ziel erreicht</span><span class="font-semibold text-[#003745]">in {{ durationYears }} Jahren ({{ targetYear }})</span></div>
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Angespartes Kapital</span><span class="font-semibold text-[#003745]">{{ formatCurrency(totalInvested) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Voraussichtlicher Endwert</span><span class="font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Davon Erträge</span><span class="font-semibold text-[#277A6B]">+{{ formatCurrency(totalReturn) }}</span></div>
            </div>
            <a
              :href="LINKS.dekaFondssparplan"
              target="_blank"
              rel="noopener noreferrer"
              class="result-link mt-4 text-sm"
            >
              <span class="result-link-label">Mehr zum Deka-FondsSparplan erfahren</span>
              <span class="material-symbols-outlined">chevron_right</span>
            </a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 bg-white p-5">
            <h3 class="mb-4 text-lg font-semibold text-[#003745]">Ohne Rendite</h3>
            <div class="mb-4">
              <div class="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Monatliche Sparrate</div>
              <div class="text-3xl font-bold text-[#003745]">{{ formatCurrency(zeroReturnMonthly) }}</div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Ziel erreicht</span><span class="font-semibold text-[#003745]">in {{ durationYears }} Jahren ({{ targetYear }})</span></div>
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Angespartes Kapital</span><span class="font-semibold text-[#003745]">{{ formatCurrency(zeroReturnInvested) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Voraussichtlicher Endwert</span><span class="font-semibold text-[#003745]">{{ formatCurrency(targetAmount) }}</span></div>
              <div class="flex items-center justify-between"><span class="text-[var(--text-secondary)]">Davon Erträge</span><span class="font-semibold text-[#003745]">0 EUR</span></div>
            </div>
          </article>
        </div>
      </section>

      <section
        v-else-if="activeTab === 'optimization'"
        id="result-panel-optimization"
        role="tabpanel"
        aria-labelledby="result-tab-optimization"
        class="space-y-6 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-8"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="text-2xl font-bold text-[#003745]">Optimierung</h2>
          <a
            :href="LINKS.sparrechner"
            target="_blank"
            rel="noopener noreferrer"
            class="motion-cta inline-flex h-11 items-center justify-center self-start rounded-[4px] border border-[#003745] bg-[#003745] px-6 text-sm font-semibold text-white hover:bg-[#002C36]"
          >
            Zum Sparrechner
          </a>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-semibold text-[#003745]">Dynamisierung</p>
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-[#003745]">
                <span class="material-symbols-outlined text-[18px]">show_chart</span>
              </span>
            </div>
            <h3 class="text-lg font-semibold text-[#003745]">Inflation ausgleichen</h3>
            <p class="mt-1 text-[var(--text-secondary)]">+2 % p. a.</p>
            <a :href="LINKS.dynamisierung" target="_blank" rel="noopener noreferrer" class="result-link mt-4 text-sm"><span class="result-link-label">Mehr erfahren</span><span class="material-symbols-outlined">chevron_right</span></a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-semibold text-[#003745]">Starteinlage</p>
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-[#003745]">
                <span class="material-symbols-outlined text-[18px]">rocket_launch</span>
              </span>
            </div>
            <h3 class="text-lg font-semibold text-[#003745]">Einmaliger Boost zum Start</h3>
            <p class="mt-1 text-[var(--text-secondary)]">+1.000 EUR einmalig</p>
            <a :href="LINKS.starteinlage" target="_blank" rel="noopener noreferrer" class="result-link mt-4 text-sm"><span class="result-link-label">Mehr erfahren</span><span class="material-symbols-outlined">chevron_right</span></a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-semibold text-[#003745]">Deka-Abräumsparen</p>
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-[#003745]">
                <span class="material-symbols-outlined text-[18px]">savings</span>
              </span>
            </div>
            <h3 class="text-lg font-semibold text-[#003745]">Überschüsse automatisch sparen</h3>
            <p class="mt-1 text-[var(--text-secondary)]">+80 EUR monatlich</p>
            <a :href="LINKS.abraeumsparen" target="_blank" rel="noopener noreferrer" class="result-link mt-4 text-sm"><span class="result-link-label">Mehr erfahren</span><span class="material-symbols-outlined">chevron_right</span></a>
          </article>

          <article class="rounded-[4px] border border-[#003745]/15 p-5">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-semibold text-[#003745]">Höhere Sparrate</p>
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-[#003745]">
                <span class="material-symbols-outlined text-[18px]">trending_up</span>
              </span>
            </div>
            <h3 class="text-lg font-semibold text-[#003745]">Schneller ans Ziel</h3>
            <p class="mt-1 text-[var(--text-secondary)]">+20 EUR monatlich</p>
            <p class="mt-4 text-sm font-semibold text-[#277A6B]">{{ optimizationTimeGainLabel }}</p>
          </article>
        </div>
      </section>

      <section
        v-else
        id="result-panel-implementation"
        role="tabpanel"
        aria-labelledby="result-tab-implementation"
        class="space-y-6 rounded-[4px] border border-[#003745]/10 bg-white p-5 md:p-8"
      >
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
              <div class="flex items-start gap-3">
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-[#003745]">
                  <span class="material-symbols-outlined text-[18px]">storefront</span>
                </span>
                <h4 class="text-lg font-semibold text-[#003745]">Abschluss in der Filiale</h4>
              </div>
              <p class="mt-2 text-sm text-[#4F7280]">Sie möchten persönlich beraten werden. Nehmen Sie Ihren Sparplan einfach mit in die Filiale. Eine Beraterin oder ein Berater prüft Ihren Plan gemeinsam mit Ihnen und schließt ihn direkt vor Ort ab.</p>
              <p class="mt-3 text-sm font-semibold text-[#003745]">So geht's</p>
              <ol class="mt-2 space-y-1 text-sm text-[#4F7280]">
                <li>1. Sparplan speichern oder ausdrucken.</li>
                <li>
                  2.
                  <a :href="LINKS.termin" target="_blank" rel="noopener noreferrer" class="result-link ml-1 text-sm"><span class="result-link-label">Termin in Ihrer Sparkassenfiliale vereinbaren.</span><span class="material-symbols-outlined">chevron_right</span></a>
                </li>
                <li>3. Persönlich besprechen und abschließen.</li>
              </ol>
            </section>

            <section class="rounded-[4px] border border-[#003745]/15 p-5">
              <div class="flex items-start gap-3">
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-[#003745]">
                  <span class="material-symbols-outlined text-[18px]">language</span>
                </span>
                <h4 class="text-lg font-semibold text-[#003745]">Abschluss in der Internetfiliale</h4>
              </div>
              <p class="mt-2 text-sm text-[#4F7280]">Sie möchten Ihren Sparplan direkt digital umsetzen. Öffnen Sie die Internetfiliale, übernehmen Sie Ihre Eckdaten und schließen Sie den Auftrag online ab.</p>
              <p class="mt-3 text-sm font-semibold text-[#003745]">So geht's</p>
              <ol class="mt-2 space-y-1 text-sm text-[#4F7280]">
                <li>1. Sparplan-Daten bereithalten.</li>
                <li>
                  2.
                  <a :href="LINKS.internetfiliale" target="_blank" rel="noopener noreferrer" class="result-link ml-1 text-sm"><span class="result-link-label">Internetfiliale öffnen.</span><span class="material-symbols-outlined">chevron_right</span></a>
                </li>
                <li>3. Auftrag online prüfen und absenden.</li>
              </ol>
            </section>

            <section class="rounded-[4px] border border-[#003745]/15 p-5">
              <div class="flex items-start gap-3">
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#003745]/15 bg-[#F4F9FA] text-[#003745]">
                  <span class="material-symbols-outlined text-[18px]">smartphone</span>
                </span>
                <h4 class="text-lg font-semibold text-[#003745]">Abschluss in der S-Invest App</h4>
              </div>
              <p class="mt-2 text-sm text-[#4F7280]">Sie nutzen die S-Invest App. Übertragen Sie Ihre Sparplan-Werte aus dieser Seite und schließen Sie den Plan direkt in der App ab.</p>
              <p class="mt-3 text-sm font-semibold text-[#003745]">So geht's</p>
              <ol class="mt-2 space-y-1 text-sm text-[#4F7280]">
                <li>1. Sparplan-Werte notieren oder als PDF speichern.</li>
                <li>2. S-Invest App öffnen und Sparplan anlegen.</li>
                <li>3. Daten übernehmen und Abschluss durchführen.</li>
              </ol>
              <p class="mt-3 text-xs font-medium text-[var(--text-secondary)]">Aktuell ist kein Direktlink zur S-Invest App hinterlegt.</p>
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
          @click="closeGoalInfoModal"
        />
      </Transition>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <Transition :css="false" @leave="runMotionLeave">
          <div
            v-if="isGoalInfoModalOpen"
            ref="modalPanelRef"
            v-motion
            :initial="modalPanelVariants.initial"
            :enter="modalPanelVariants.enter"
            :leave="modalPanelVariants.leave"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="modalTitleId"
            tabindex="-1"
            class="pointer-events-auto relative w-full max-w-xl space-y-4 rounded-[4px] border border-[#D8E5E8] bg-[#F4F9FA] p-5 shadow-xl sm:p-6"
            @keydown="handleModalKeydown"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 :id="modalTitleId" class="text-lg font-bold text-[#003745]">Wie setzt sich der Zielbetrag zusammen?</h3>
              <button
                type="button"
                class="ui-button ui-button-secondary h-auto px-2 py-1 text-sm"
                @click="closeGoalInfoModal"
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
