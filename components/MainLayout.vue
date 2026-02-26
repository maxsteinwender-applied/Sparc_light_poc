<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw, onMounted, ref, type Component, watch } from 'vue'
import { useWizard } from '../composables/useWizard'
import { parseResultDeepLink } from '../domain/resultDeepLink'
import { runMotionLeave } from '../motion/leaveHook'
import MotionStepShell from './motion/MotionStepShell.vue'
import PrototypeTickerBar from './PrototypeTickerBar.vue'
import { GOALS } from './goalsData'
import type { GoalId } from './goalsData'

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
  return Math.min(5, Math.max(1, step.value))
})

const progressItems = [
  { label: 'Sparziel' },
  { label: 'Zielbetrag' },
  { label: 'Spardauer' },
  { label: 'Ergebnis' },
]

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

const stepLoaders = {
  1: () => import('./Step1_GoalSelection.vue'),
  2: () => import('./Step2_TargetAmountType.vue'),
  3: () => import('./Step3_CalculateAmount.vue'),
  4: () => import('./Step4_Duration.vue'),
  5: () => import('./Step5_Results.vue'),
} as const

const stepComponents: Record<number, Component> = {
  1: markRaw(defineAsyncComponent(stepLoaders[1])),
  2: markRaw(defineAsyncComponent(stepLoaders[2])),
  3: markRaw(defineAsyncComponent(stepLoaders[3])),
  4: markRaw(defineAsyncComponent(stepLoaders[4])),
  5: markRaw(defineAsyncComponent(stepLoaders[5])),
}

const activeStepComponent = computed(() => stepComponents[clampedStep.value])
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

    if (nextStep <= 4) {
      preloadStep(nextStep)
    }
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
    hasResolvedDeepLink.value = true
    return
  }

  if (parsed.strategy === 'custom') {
    if (typeof parsed.rate !== 'number') {
      hasResolvedDeepLink.value = true
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
</script>

<template>
  <div class="min-h-screen bg-white text-[#003745] font-sans selection:bg-[#EE0000] selection:text-white">
    <div class="sticky top-0 z-[110]">
      <PrototypeTickerBar />
    </div>

    <main class="w-full overflow-x-clip">
      <div class="border-b border-[#E6EEF0] bg-white">
        <div class="flex justify-center px-4 pb-4 pt-5 sm:pb-5">
          <ol class="grid w-full max-w-[820px] grid-cols-4 gap-3 sm:gap-6" aria-label="Fortschritt">
            <li
              v-for="(item, index) in progressItems"
              :key="item.label"
              class="flex flex-col"
            >
              <div class="flex items-center">
                <span
                  :class="[
                    'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-[180ms] ease-[var(--motion-ease-standard)]',
                    activeProgressStage > index + 1
                      ? 'bg-[#003745] text-white'
                      : activeProgressStage === index + 1
                        ? 'bg-[#003745] text-white'
                        : 'bg-[#E5EAF0] text-[#7A8C98]',
                  ]"
                >
                  {{ index + 1 }}
                </span>
                <span
                  v-if="index < progressItems.length - 1"
                  :class="[
                    'mx-2 h-px flex-1 transition-colors duration-[180ms] ease-[var(--motion-ease-standard)]',
                    activeProgressStage > index + 1 ? 'bg-[#003745]' : 'bg-[#D4DEE6]',
                  ]"
                />
              </div>
              <span
                class="mt-2 hidden text-sm font-medium sm:block"
                :class="activeProgressStage === index + 1 ? 'text-[#003745]' : 'text-[#8C98A3]'"
              >
                {{ item.label }}
              </span>
            </li>
          </ol>
        </div>
      </div>

      <Transition mode="out-in" :css="false" @leave="runMotionLeave">
        <MotionStepShell :key="clampedStep" :direction="transitionDirection">
          <component :is="activeStepComponent" />
        </MotionStepShell>
      </Transition>
    </main>

    <footer v-if="clampedStep < 5" class="py-8 text-center text-sm text-[var(--text-muted)]">
      © 2026 DekaBank Deutsche Girozentrale
    </footer>
  </div>
</template>
