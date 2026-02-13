<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useWizard } from '../composables/useWizard'
import { calculateSavingsPlan } from '../domain/savingsPlan'
import { runMotionLeave } from '../motion/leaveHook'
import {
  getModalBackdropVariants,
  getModalPanelVariants,
  getStaggerItemVariants,
} from '../motion/presets'
import { useMotionSafety } from '../motion/useMotionSafety'
import { parseEuroInput } from '../domain/wizardValidation'
import { getGoal } from './goalsData'
import ResultProjectionChart from './charts/ResultProjectionChart.vue'
import { formatCurrency } from './ui/utils'
import type { StrategyType } from '../stores/wizard'
import { isEmailConfigured, sendResultEmail, validateRecipientEmail } from '../services/email'

const {
  targetAmount,
  setTargetAmount,
  durationYears,
  setDurationYears,
  selectedStrategy,
  setSelectedStrategy,
  goal,
  customGoalName,
  setStep,
  resetFlow,
} = useWizard()

const showZeroReturn = ref(false)
const targetAmountInput = ref(String(targetAmount.value))
const isExporting = ref(false)
const pdfContainerRef = ref<HTMLElement | null>(null)

const isEmailDialogOpen = ref(false)
const recipientEmail = ref('')
const recipientName = ref('')
const isSendingEmail = ref(false)
const emailError = ref('')
const emailSuccess = ref('')
const emailConfigured = computed(() => isEmailConfigured())
const { prefersReducedMotion } = useMotionSafety()

watch(targetAmount, (nextValue) => {
  targetAmountInput.value = String(nextValue)
})

const currentGoal = computed(() => getGoal(goal.value))
const currentStrategy = computed(() => currentGoal.value.strategies[selectedStrategy.value])

const goalLabel = computed(() => {
  if (goal.value === 'custom') {
    return customGoalName.value || 'Ziel'
  }

  return currentGoal.value.label
})

const strategyKeys = computed(() => {
  return Object.keys(currentGoal.value.strategies) as StrategyType[]
})

const projection = computed(() => {
  return calculateSavingsPlan({
    targetAmount: targetAmount.value,
    durationYears: durationYears.value,
    annualRate: currentStrategy.value.rate,
    showZeroReturn: showZeroReturn.value,
  })
})

const chartRows = computed(() => {
  return projection.value.chartData
})

const projectedValue = computed(() => targetAmount.value)
const monthlySavings = computed(() => projection.value.monthlySavings)
const totalInvested = computed(() => projection.value.totalInvested)
const totalReturn = computed(() => projection.value.totalReturn)
const zeroReturnMonthly = computed(() => projection.value.zeroReturnMonthly)
const monthlyDifference = computed(() => projection.value.monthlyDifference)
const targetYear = computed(() => projection.value.targetYear)
const modalBackdropVariants = computed(() =>
  getModalBackdropVariants(prefersReducedMotion.value),
)
const modalPanelVariants = computed(() =>
  getModalPanelVariants(prefersReducedMotion.value),
)

const staggerInitial = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).initial
const staggerEnter = (index: number) =>
  getStaggerItemVariants(index, prefersReducedMotion.value).enter

const applyTargetAmountInput = () => {
  const parsed = parseEuroInput(targetAmountInput.value)
  if (parsed === null) {
    targetAmountInput.value = String(targetAmount.value)
    return
  }

  setTargetAmount(parsed)
  targetAmountInput.value = String(parsed)
}

const decrementDuration = () => {
  setDurationYears(durationYears.value - 1)
}

const incrementDuration = () => {
  setDurationYears(durationYears.value + 1)
}

const goBack = () => {
  setStep(4)
}

const emailPayload = computed(() => {
  const summaryLines = [
    `Ziel: ${goalLabel.value}`,
    `Laufzeit: ${durationYears.value} Jahre (bis ${targetYear.value})`,
    `Monatliche Sparrate: ${formatCurrency(monthlySavings.value)}`,
    `Strategie: ${currentStrategy.value.label} (${(currentStrategy.value.rate * 100).toFixed(1).replace('.', ',')} % p. a.)`,
    `Investiertes Kapital: ${formatCurrency(totalInvested.value)}`,
    `Erträge: +${formatCurrency(totalReturn.value)}`,
    `Voraussichtlicher Endwert: ${formatCurrency(projectedValue.value)}`,
    `Ohne Rendite benötigte Rate: ${formatCurrency(zeroReturnMonthly.value)}`,
    `Monatliche Differenz ggü. 0 %: ${monthlyDifference.value > 0 ? '+' : ''}${formatCurrency(monthlyDifference.value)}`,
  ]

  const interpretation =
    monthlyDifference.value > 0
      ? `Ohne Rendite wären monatlich ${formatCurrency(monthlyDifference.value)} mehr nötig, um das gleiche Ziel im gleichen Zeitraum zu erreichen.`
      : 'Die monatliche Sparleistung liegt auf dem Niveau eines 0-%-Szenarios oder darunter.'

  return {
    goal_label: goalLabel.value,
    target_amount: formatCurrency(projectedValue.value),
    duration_years: `${durationYears.value}`,
    target_year: `${targetYear.value}`,
    monthly_savings: formatCurrency(monthlySavings.value),
    strategy_label: currentStrategy.value.label,
    strategy_rate_label: `${(currentStrategy.value.rate * 100).toFixed(1).replace('.', ',')} % p. a.`,
    total_invested: formatCurrency(totalInvested.value),
    total_return: `+${formatCurrency(totalReturn.value)}`,
    zero_return_monthly: formatCurrency(zeroReturnMonthly.value),
    monthly_difference: `${monthlyDifference.value > 0 ? '+' : ''}${formatCurrency(monthlyDifference.value)}`,
    date_label: new Date().toLocaleDateString('de-DE'),
    result_summary: summaryLines.join('\n'),
    result_interpretation: interpretation,
  }
})

const handleExportPdf = async () => {
  if (!pdfContainerRef.value || isExporting.value) {
    return
  }

  isExporting.value = true
  await nextTick()

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready
    }

    const canvas = await html2canvas(pdfContainerRef.value, {
      backgroundColor: '#FFFFFF',
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const maxWidth = pageWidth - margin * 2
    const maxHeight = pageHeight - margin * 2
    const widthScale = maxWidth / canvas.width
    const heightScale = maxHeight / canvas.height
    const scale = Math.min(widthScale, heightScale)
    const renderWidth = canvas.width * scale
    const renderHeight = canvas.height * scale
    const offsetX = (pageWidth - renderWidth) / 2
    const offsetY = (pageHeight - renderHeight) / 2

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST')

    const slug =
      goalLabel.value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'ziel'
    const datePart = new Date().toISOString().slice(0, 10)
    pdf.save(`sparplan-${slug}-${datePart}.pdf`)
  } catch (error) {
    console.error('PDF export failed:', error)
    window.alert('PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.')
  } finally {
    isExporting.value = false
  }
}

const handleOpenEmailDialog = () => {
  emailError.value = ''
  emailSuccess.value = ''
  isEmailDialogOpen.value = true
}

const handleCloseEmailDialog = () => {
  if (isSendingEmail.value) {
    return
  }
  isEmailDialogOpen.value = false
  emailError.value = ''
}

const handleSendEmail = async () => {
  emailError.value = ''
  emailSuccess.value = ''

  if (!emailConfigured.value) {
    emailError.value = 'E-Mail-Versand ist nicht konfiguriert. Bitte VITE_EMAILJS_* Variablen setzen.'
    return
  }

  if (!validateRecipientEmail(recipientEmail.value)) {
    emailError.value = 'Bitte eine gültige E-Mail-Adresse eingeben.'
    return
  }

  const cooldownKey = 'result_email_last_sent_at'
  const cooldownMs = 30_000
  const lastSentAt = Number(sessionStorage.getItem(cooldownKey) || '0')
  const elapsed = Date.now() - lastSentAt
  if (elapsed < cooldownMs) {
    const remaining = Math.ceil((cooldownMs - elapsed) / 1000)
    emailError.value = `Bitte warten Sie noch ${remaining} Sekunden bis zum nächsten Versand.`
    return
  }

  isSendingEmail.value = true
  const result = await sendResultEmail({
    to_email: recipientEmail.value.trim(),
    to_name: recipientName.value.trim(),
    ...emailPayload.value,
  })
  isSendingEmail.value = false

  if (!result.ok) {
    emailError.value = result.message
    return
  }

  sessionStorage.setItem(cooldownKey, `${Date.now()}`)
  emailSuccess.value = 'Ergebnis wurde per E-Mail gesendet.'
  isEmailDialogOpen.value = false
  recipientName.value = ''
  recipientEmail.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="border-b border-[#003745]/10 bg-[#F4F9FA] px-4 pb-12 pt-8">
      <div class="relative mx-auto max-w-6xl">
        <button
          type="button"
          class="absolute left-0 top-0 flex items-center gap-2 text-sm font-medium text-[#568996] transition-colors hover:text-[#003745]"
          @click="goBack"
        >
          Zurück
        </button>

        <div class="mb-12 flex flex-col items-center pb-2 pt-8 text-center">
          <span class="mb-3 block text-sm font-medium uppercase tracking-widest text-[#EE0000]">Schritt 5 von 5</span>
          <h1 class="mb-4 text-4xl font-bold tracking-tight text-[#003745] md:text-5xl">Ihr Ziel wird greifbar.</h1>
          <p class="max-w-2xl text-xl font-light text-[#568996]">
            Mit Ihrem Plan erreichen Sie <span class="font-semibold text-[#003745]">{{ formatCurrency(projectedValue) }}</span> in
            <span class="font-semibold text-[#003745]"> {{ durationYears }} Jahren</span>.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            v-motion
            :initial="staggerInitial(0)"
            :enter="staggerEnter(0)"
            class="relative flex h-full flex-col items-center justify-center rounded-[4px] border border-[#003745] bg-[#003745] p-6 text-center shadow-md"
          >
            <span class="mb-2 text-xs font-bold uppercase tracking-wider text-[#9FB6BC]">MONATLICHE SPARRATE</span>
            <span class="mb-2 text-4xl font-bold tracking-tight text-white">{{ formatCurrency(monthlySavings) }}</span>
            <span class="rounded-[4px] bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#9FB6BC]">Errechnet</span>
          </div>

          <div
            v-motion
            :initial="staggerInitial(1)"
            :enter="staggerEnter(1)"
            class="flex h-full flex-col items-center justify-center rounded-[4px] border border-[#003745]/20 bg-white p-6 text-center"
          >
            <span class="mb-2 text-xs font-bold uppercase tracking-wider text-[#568996]">LAUFZEIT</span>
            <div class="mb-3 text-3xl font-bold text-[#003745]">{{ durationYears }} Jahre</div>
            <div class="flex gap-2">
              <button
                type="button"
                class="h-9 w-9 rounded-[4px] border border-[#003745]/20 text-[#003745] transition-colors hover:border-[#003745] hover:bg-[#F4F9FA]"
                @click="decrementDuration"
              >
                -
              </button>
              <button
                type="button"
                class="h-9 w-9 rounded-[4px] border border-[#003745]/20 text-[#003745] transition-colors hover:border-[#003745] hover:bg-[#F4F9FA]"
                @click="incrementDuration"
              >
                +
              </button>
            </div>
          </div>

          <div
            v-motion
            :initial="staggerInitial(2)"
            :enter="staggerEnter(2)"
            class="flex h-full flex-col items-center justify-center rounded-[4px] border border-[#003745]/20 bg-white p-6 text-center"
          >
            <span class="mb-2 text-xs font-bold uppercase tracking-wider text-[#568996]">ZIELBETRAG</span>
            <div class="mb-3 text-3xl font-bold text-[#003745]">{{ formatCurrency(projectedValue) }}</div>
            <div class="flex w-full max-w-[220px] items-center gap-2">
              <input
                v-model="targetAmountInput"
                type="text"
                inputmode="numeric"
                class="h-9 w-full rounded-[4px] border border-[#003745]/20 px-3 text-sm text-[#003745] outline-none focus:border-[#003745] focus:ring-1 focus:ring-[#003745]"
              />
              <button
                type="button"
                class="h-9 rounded-[4px] border border-[#003745] px-3 text-sm font-medium text-[#003745] transition-colors hover:bg-[#F4F9FA]"
                @click="applyTargetAmountInput"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-8 max-w-6xl space-y-8 px-4">
      <section class="rounded-[4px] bg-[#F5EFE4] p-6 md:p-8">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-[#003745]">Renditeauswahl</h2>
          <button
            type="button"
            class="text-sm font-medium text-[#003745] underline-offset-2 hover:underline"
            @click="showZeroReturn = !showZeroReturn"
          >
            {{ showZeroReturn ? 'Mit Rendite anzeigen' : '0 % Vergleich einblenden' }}
          </button>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <button
            v-for="(strategyKey, strategyIndex) in strategyKeys"
            :key="strategyKey"
            v-motion
            :initial="staggerInitial(strategyIndex + 3)"
            :enter="staggerEnter(strategyIndex + 3)"
            type="button"
            class="relative rounded-[4px] p-4 text-left transition-[transform,box-shadow,border-color,background-color] duration-[180ms] ease-[var(--motion-ease-standard)] md:p-6"
            :class="
              selectedStrategy === strategyKey
                ? 'border-2 border-[#003745] bg-[#003745]/10'
                : 'border border-[#003745]/20 bg-white shadow-sm hover:border-[#003745]'
            "
            @click="setSelectedStrategy(strategyKey)"
          >
            <div class="mb-3 flex items-start justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider" :class="selectedStrategy === strategyKey ? 'text-[#003745]' : 'text-[#568996]'">
                {{ currentGoal.strategies[strategyKey].label }}
              </span>
              <span v-if="selectedStrategy === strategyKey" class="text-[#003745]">✓</span>
            </div>
            <h3 class="mb-1 text-base font-bold text-[#003745] md:text-lg">{{ currentGoal.strategies[strategyKey].product }}</h3>
            <div class="mb-2 text-2xl font-bold text-[#003745] md:text-3xl">
              ca. {{ (currentGoal.strategies[strategyKey].rate * 100).toFixed(1).replace('.', ',') }} %
              <span class="text-sm font-normal text-[#568996]">p. a.</span>
            </div>
            <p class="text-xs text-[#568996] md:text-sm">{{ currentGoal.strategies[strategyKey].description }}</p>
          </button>
        </div>
      </section>

      <section class="rounded-[4px] border border-[#003745]/10 bg-white p-6 md:p-8">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-[#003745]">Übersicht für {{ goalLabel }}</h2>
          <div class="text-right text-sm text-[#568996]">
            <div>Zieljahr {{ targetYear }}</div>
            <div>Laufzeit {{ durationYears }} Jahre</div>
          </div>
        </div>

        <div class="grid gap-8 md:grid-cols-2">
          <div
            v-motion
            :initial="staggerInitial(6)"
            :enter="staggerEnter(6)"
            class="rounded-[4px] border border-[#003745]/10 bg-white p-6"
          >
            <h3 class="mb-4 text-lg font-bold text-[#003745]">Mit FondsSparplan</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm"><span class="text-[#568996]">Monatliche Sparrate</span><span class="font-semibold text-[#003745]">{{ formatCurrency(monthlySavings) }}</span></div>
              <div class="flex items-center justify-between text-sm"><span class="text-[#568996]">Investiertes Kapital</span><span class="font-semibold text-[#003745]">{{ formatCurrency(totalInvested) }}</span></div>
              <div class="flex items-center justify-between text-sm"><span class="text-[#568996]">Voraussichtlicher Endwert</span><span class="font-semibold text-[#003745]">{{ formatCurrency(projectedValue) }}</span></div>
              <div class="flex items-center justify-between text-sm"><span class="text-[#568996]">Davon Erträge</span><span class="font-semibold text-[#277A6B]">+{{ formatCurrency(totalReturn) }}</span></div>
            </div>
          </div>

          <div
            v-motion
            :initial="staggerInitial(7)"
            :enter="staggerEnter(7)"
            class="rounded-[4px] border border-[#003745]/10 bg-[#F5EFE4] p-6"
          >
            <h3 class="mb-4 text-lg font-bold text-[#003745]">Ohne Rendite (0 %)</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm"><span class="text-[#568996]">Benötigte Sparrate</span><span class="font-semibold text-[#003745]">{{ formatCurrency(zeroReturnMonthly) }}</span></div>
              <div class="flex items-center justify-between text-sm"><span class="text-[#568996]">Voraussichtlicher Endwert</span><span class="font-semibold text-[#003745]">{{ formatCurrency(projectedValue) }}</span></div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-[#568996]">Monatliche Differenz</span>
                <span class="font-semibold" :class="monthlyDifference > 0 ? 'text-[#277A6B]' : 'text-[#003745]'">
                  {{ monthlyDifference > 0 ? '+' : '' }}{{ formatCurrency(monthlyDifference) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 overflow-x-auto">
          <ResultProjectionChart :chart-data="chartRows" />
        </div>

        <div class="mt-8 overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th class="border-b border-[#E6EEF0] px-3 py-2 text-[#568996]">Jahr</th>
                <th class="border-b border-[#E6EEF0] px-3 py-2 text-[#568996]">Eingezahlt</th>
                <th class="border-b border-[#E6EEF0] px-3 py-2 text-[#568996]">Wert (Strategie)</th>
                <th class="border-b border-[#E6EEF0] px-3 py-2 text-[#568996]">0 % Vergleich</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in chartRows" :key="row.year">
                <td class="border-b border-[#F0F4F5] px-3 py-2 text-[#003745]">{{ row.year }}</td>
                <td class="border-b border-[#F0F4F5] px-3 py-2 text-[#003745]">{{ formatCurrency(row.invested) }}</td>
                <td class="border-b border-[#F0F4F5] px-3 py-2 text-[#003745]">{{ formatCurrency(row.value) }}</td>
                <td class="border-b border-[#F0F4F5] px-3 py-2 text-[#003745]">{{ formatCurrency(row.zeroReturn) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="mt-12 border-t border-[#003745]/10 bg-white px-0 pb-10 pt-8">
        <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:justify-center">
          <button
            type="button"
            class="motion-cta w-full rounded-[4px] border border-[#003745] bg-[#003745] px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[#002C36] md:w-auto"
            @click="setStep(4)"
          >
            Plan anpassen
          </button>
          <button
            type="button"
            :disabled="isExporting"
            class="motion-cta w-full rounded-[4px] border border-[#003745]/20 bg-white px-8 py-3 text-base font-medium text-[#003745] transition-colors hover:bg-[#F4F9FA] disabled:cursor-not-allowed disabled:border-[#9FB6BC] disabled:text-[#9FB6BC] md:w-auto"
            @click="handleExportPdf"
          >
            {{ isExporting ? 'Erzeuge PDF...' : 'PDF exportieren' }}
          </button>
          <button
            type="button"
            :disabled="!emailConfigured"
            class="motion-cta w-full rounded-[4px] border border-[#003745]/20 bg-white px-8 py-3 text-base font-medium text-[#003745] transition-colors hover:bg-[#F4F9FA] disabled:cursor-not-allowed disabled:border-[#9FB6BC] disabled:text-[#9FB6BC] md:w-auto"
            @click="handleOpenEmailDialog"
          >
            Ergebnis per E-Mail
          </button>
          <button
            type="button"
            class="motion-cta w-full rounded-[4px] border border-[#003745]/20 bg-white px-8 py-3 text-base font-medium text-[#003745] transition-colors hover:bg-[#F4F9FA] md:w-auto"
            @click="resetFlow"
          >
            Neuen Plan starten
          </button>
        </div>

        <p v-if="!emailConfigured" class="mt-4 text-center text-sm text-[#AD1111]">
          E-Mail-Versand ist nicht konfiguriert. Setzen Sie `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` und `VITE_EMAILJS_PUBLIC_KEY`.
        </p>
        <p v-if="emailSuccess" class="mt-4 text-center text-sm text-[#277A6B]">
          {{ emailSuccess }}
        </p>
      </div>

      <div class="pointer-events-none fixed inset-0 z-[120]">
        <Transition :css="false" @leave="runMotionLeave">
          <button
            v-if="isEmailDialogOpen"
            v-motion
            :initial="modalBackdropVariants.initial"
            :enter="modalBackdropVariants.enter"
            :leave="modalBackdropVariants.leave"
            aria-label="Modal schließen"
            class="pointer-events-auto absolute inset-0 bg-[#003745]/45 backdrop-blur-[1px]"
            @click="handleCloseEmailDialog"
          />
        </Transition>

        <div class="absolute inset-0 flex items-center justify-center p-4">
          <Transition :css="false" @leave="runMotionLeave">
            <div
              v-if="isEmailDialogOpen"
              v-motion
              :initial="modalPanelVariants.initial"
              :enter="modalPanelVariants.enter"
              :leave="modalPanelVariants.leave"
              role="dialog"
              aria-modal="true"
              aria-label="Ergebnis per E-Mail senden"
              class="pointer-events-auto relative w-full max-w-xl space-y-4 rounded-[4px] border border-[#D8E5E8] bg-[#F4F9FA] p-5 shadow-xl sm:p-6"
            >
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-lg font-bold text-[#003745]">Ergebnis per E-Mail senden</h3>
                <button
                  type="button"
                  class="rounded-[4px] border border-[#003745]/20 px-2 py-1 text-sm text-[#003745] hover:bg-white"
                  @click="handleCloseEmailDialog"
                >
                  Schließen
                </button>
              </div>
              <p class="text-sm text-[#568996]">Versand als POC direkt aus dem Browser via EmailJS.</p>
              <div class="space-y-3">
                <div>
                  <label class="mb-1 block text-sm font-medium text-[#003745]">E-Mail-Adresse *</label>
                  <input
                    v-model="recipientEmail"
                    type="email"
                    placeholder="name@beispiel.de"
                    class="w-full rounded-[4px] border border-[#003745]/20 bg-white px-3 py-2.5 text-sm text-[#003745] outline-none focus:border-[#003745] focus:ring-2 focus:ring-[#003745]"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-medium text-[#003745]">Name (optional)</label>
                  <input
                    v-model="recipientName"
                    type="text"
                    placeholder="Max Mustermann"
                    class="w-full rounded-[4px] border border-[#003745]/20 bg-white px-3 py-2.5 text-sm text-[#003745] outline-none focus:border-[#003745] focus:ring-2 focus:ring-[#003745]"
                  />
                </div>
              </div>

              <p v-if="emailError" class="text-sm text-[#AD1111]">{{ emailError }}</p>

              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="isSendingEmail"
                  class="motion-cta rounded-[4px] border px-4 py-2 text-sm font-medium transition-colors"
                  :class="
                    isSendingEmail
                      ? 'cursor-not-allowed border-[#9FB6BC] bg-white text-[#9FB6BC]'
                      : 'border-[#003745] bg-[#003745] text-white hover:bg-[#002C36]'
                  "
                  @click="handleSendEmail"
                >
                  {{ isSendingEmail ? 'Sende...' : 'Senden' }}
                </button>
                <button
                  type="button"
                  class="motion-cta rounded-[4px] border border-[#003745]/20 bg-white px-4 py-2 text-sm font-medium text-[#003745] hover:bg-[#F4F9FA]"
                  @click="handleCloseEmailDialog"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="pointer-events-none fixed left-[-10000px] top-0 z-[-1]">
        <div
          ref="pdfContainerRef"
          class="bg-white"
          style="width: 794px; min-height: 1123px; padding: 64px; color: #003745; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;"
        >
          <div style="border-bottom: 2px solid #003745; padding-bottom: 24px; margin-bottom: 28px;">
            <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #568996; font-weight: 700;">
              Sparc Light · Ergebnisbericht
            </div>
            <h1 style="font-size: 38px; line-height: 1.15; font-weight: 700; margin: 10px 0 0 0; letter-spacing: -0.02em;">
              Ihr Sparplan auf einen Blick
            </h1>
            <p style="margin-top: 12px; margin-bottom: 0; font-size: 14px; color: #568996; line-height: 1.45;">
              Ziel: <strong>{{ goalLabel }}</strong> · Datum: {{ emailPayload.date_label }}
            </p>
          </div>

          <div style="display: grid; gap: 10px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
              Monatliche Sparrate: <strong>{{ formatCurrency(monthlySavings) }}</strong>
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
              Laufzeit: <strong>{{ durationYears }} Jahre</strong> (bis {{ targetYear }})
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
              Investiertes Kapital: <strong>{{ formatCurrency(totalInvested) }}</strong>
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
              Davon Erträge: <strong>+{{ formatCurrency(totalReturn) }}</strong>
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
              Ohne Rendite benötigte Rate: <strong>{{ formatCurrency(zeroReturnMonthly) }}</strong>
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">
              Monatliche Differenz: <strong>{{ monthlyDifference > 0 ? '+' : '' }}{{ formatCurrency(monthlyDifference) }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
