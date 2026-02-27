<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw, onMounted, provide, ref, watch } from 'vue'
import { useWizard } from '../composables/useWizard'
import { parseResultDeepLink } from '../domain/resultDeepLink'
import { runMotionLeave } from '../motion/leaveHook'
import MotionStepShell from './motion/MotionStepShell.vue'
import PrototypeTickerBar from './PrototypeTickerBar.vue'
import { GOALS } from './goalsData'
import type { GoalId } from './goalsData'

const props = withDefaults(
  defineProps<{
    showPrototypeTicker?: boolean
    fillViewport?: boolean
  }>(),
  {
    showPrototypeTicker: true,
    fillViewport: true,
  },
)

const route = useRoute()
const {
  step,
  transitionDirection,
  setGoal,
  setTargetAmount,
  setDurationYears,
  setSelectedStrategy,
  setCustomAnnualRate,
  setStep,
} = useWizard()

const clampedStep = computed(() => {
  const boundedStep = Math.min(5, Math.max(0, step.value))
  return boundedStep === 3 ? 4 : boundedStep
})
const progressBackgroundClass = computed(() => 'bg-white')

provide('wizardDisableResultAutoScroll', !props.showPrototypeTicker)

const progressItems = [
  { step: 1, label: 'Sparziel' },
  { step: 2, label: 'Zielbetrag' },
  { step: 4, label: 'Spardauer' },
  { step: 5, label: 'Ergebnis' },
] as const

const activeProgressStage = computed(() => {
  if (clampedStep.value <= 1) {
    return 1
  }
  if (clampedStep.value <= 3) {
    return 2
  }
  if (clampedStep.value === 4) {
    return 3
  }
  return 4
})

const isDone = (index: number) => activeProgressStage.value > index + 1
const isActive = (index: number) => activeProgressStage.value === index + 1
const isUpcoming = (index: number) => activeProgressStage.value < index + 1
const canNavigate = (index: number) => isDone(index)

const getProgressTextClass = (index: number) => {
  if (isActive(index)) {
    return 'text-[var(--progress-text-active)]'
  }
  if (isDone(index)) {
    return 'text-[var(--progress-text-done)]'
  }
  return 'text-[var(--progress-text-open)]'
}

const getProgressStatusLabel = (index: number) => {
  if (isActive(index)) {
    return 'aktuell'
  }
  if (isDone(index)) {
    return 'abgeschlossen'
  }
  if (isUpcoming(index)) {
    return 'noch offen'
  }
  return 'noch offen'
}

const getProgressAriaLabel = (index: number) => {
  const item = progressItems[index]
  if (!item) {
    return ''
  }

  return `Schritt ${index + 1}: ${item.label} (${getProgressStatusLabel(index)})`
}

const getProgressButtonAriaLabel = (index: number) => {
  const item = progressItems[index]
  if (!item) {
    return ''
  }

  return `Zu Schritt ${index + 1}: ${item.label} wechseln`
}

const goToProgressStep = (index: number) => {
  if (!canNavigate(index)) {
    return
  }

  setStep(progressItems[index].step)
}

const stepLoaders = {
  0: () => import('./Step0_Intro.vue'),
  1: () => import('./Step1_GoalSelection.vue'),
  2: () => import('./Step2_TargetAmountType.vue'),
  4: () => import('./Step4_Duration.vue'),
  5: () => import('./Step5_Results.vue'),
} as const

const stepComponents = {
  0: markRaw(defineAsyncComponent(stepLoaders[0])),
  1: markRaw(defineAsyncComponent(stepLoaders[1])),
  2: markRaw(defineAsyncComponent(stepLoaders[2])),
  4: markRaw(defineAsyncComponent(stepLoaders[4])),
  5: markRaw(defineAsyncComponent(stepLoaders[5])),
} as const

const activeStepComponent = computed(() => stepComponents[clampedStep.value as keyof typeof stepComponents])
const hasResolvedDeepLink = ref(false)

const preloadStep = (stepNumber: number) => {
  const loader = stepLoaders[stepNumber as keyof typeof stepLoaders]
  if (!loader) {
    return
  }

  void loader()
}

watch(
  clampedStep,
  (currentStep) => {
    const nextStep = currentStep + 1

    preloadStep(nextStep)
  },
  { immediate: true },
)

const GOAL_IDS = new Set<GoalId>(GOALS.map((entry) => entry.id))

const applyResultDeepLink = () => {
  if (hasResolvedDeepLink.value) {
    return
  }

  const parsed = parseResultDeepLink(route.query as Record<string, unknown>)
  if (!parsed || !GOAL_IDS.has(parsed.goal as GoalId)) {
    return
  }

  if (parsed.strategy === 'custom') {
    if (typeof parsed.rate !== 'number') {
      return
    }
    setCustomAnnualRate(parsed.rate)
  }

  setGoal(parsed.goal as GoalId)
  setTargetAmount(parsed.target)
  setDurationYears(parsed.years)
  setSelectedStrategy(parsed.strategy)
  setStep(5)
  hasResolvedDeepLink.value = true
}

onMounted(() => {
  applyResultDeepLink()
})

watch(
  () => route.query,
  () => {
    applyResultDeepLink()
  },
  { deep: true },
)
</script>

<template>
  <div :class="[props.fillViewport ? 'min-h-screen' : 'min-h-0', 'bg-white text-[#003745] font-sans selection:bg-[#EE0000] selection:text-white']">
    <div v-if="props.showPrototypeTicker" class="sticky top-0 z-[110]">
      <PrototypeTickerBar />
    </div>

    <main class="w-full overflow-x-clip">
      <div v-if="clampedStep > 0" :class="progressBackgroundClass">
        <div class="flex justify-center px-4 pb-4 pt-5 sm:pb-5">
          <ol class="flex w-full max-w-[820px] items-center gap-0" aria-label="Fortschritt">
            <template v-for="(item, index) in progressItems" :key="item.label">
              <li
                class="flex min-w-[60px] flex-col items-center text-center"
                :data-testid="`progress-item-${index + 1}`"
                :aria-current="isActive(index) ? 'step' : undefined"
              >
                <component
                  :is="canNavigate(index) ? 'button' : 'span'"
                  :type="canNavigate(index) ? 'button' : undefined"
                  :aria-label="canNavigate(index) ? getProgressButtonAriaLabel(index) : getProgressAriaLabel(index)"
                  :class="[
                    'inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-[180ms] ease-[var(--motion-ease-standard)]',
                    canNavigate(index)
                      ? 'bg-[#003745] text-white cursor-pointer hover:bg-[#1A6B80]'
                      : isActive(index)
                        ? 'bg-[#003745] text-white'
                        : 'bg-[#E5EAF0]',
                    !canNavigate(index) && !isActive(index) ? getProgressTextClass(index) : '',
                  ]"
                  @click="goToProgressStep(index)"
                >
                  <span
                    v-if="canNavigate(index)"
                    class="material-symbols-outlined text-[18px] text-white"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  <span v-else>{{ index + 1 }}</span>
                </component>
                <span
                  class="mt-2 hidden text-xs font-medium sm:block"
                  :class="getProgressTextClass(index)"
                >
                  {{ item.label }}
                </span>
                <span class="sr-only">{{ getProgressStatusLabel(index) }}</span>
              </li>

              <span
                v-if="index < progressItems.length - 1"
                :class="[
                  'mb-3 h-[2px] flex-1 transition-colors duration-[180ms] ease-[var(--motion-ease-standard)]',
                  isDone(index) ? 'bg-[#003745]' : 'bg-[#D4DEE6]',
                ]"
              />
            </template>
          </ol>
        </div>
      </div>

      <Transition mode="out-in" :css="false" @leave="runMotionLeave">
        <MotionStepShell :key="clampedStep" :direction="transitionDirection">
          <component :is="activeStepComponent" />
        </MotionStepShell>
      </Transition>
    </main>

  </div>
</template>
