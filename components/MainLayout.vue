<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw, onMounted, ref, type Component, watch } from 'vue'
import dekaLogoImage from '~/assets/e088cf5e6488ed30341523cb4f504779a4587bd6.png'
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
  resetFlow,
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

      <header class="border-b border-[#E6EEF0] bg-white">
        <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <button class="flex items-center gap-2" type="button" @click="resetFlow">
            <img :src="dekaLogoImage" alt="DekaBank Logo" class="h-8 w-auto" />
            <span class="text-lg font-bold tracking-tight text-[#003745]">Sparc Light</span>
          </button>

          <div class="flex gap-2">
            <div
              v-for="progressStep in 5"
              :key="progressStep"
              :class="[
                'h-1.5 rounded-full transition-[width,background-color] duration-[180ms] ease-[var(--motion-ease-standard)]',
                clampedStep >= progressStep ? 'w-8 bg-[#003745]' : 'w-2 bg-[#003745]/25',
              ]"
            />
          </div>
        </div>
      </header>
    </div>

    <main class="w-full overflow-x-clip">
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
