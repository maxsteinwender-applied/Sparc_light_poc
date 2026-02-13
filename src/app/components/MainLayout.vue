<script setup lang="ts">
import { computed, markRaw, type Component } from 'vue'
import dekaLogoImage from '@/assets/e088cf5e6488ed30341523cb4f504779a4587bd6.png'
import { useWizard } from '../composables/useWizard'
import { runMotionLeave } from '../motion/leaveHook'
import Step1GoalSelection from './Step1_GoalSelection.vue'
import Step2TargetAmountType from './Step2_TargetAmountType.vue'
import Step3CalculateAmount from './Step3_CalculateAmount.vue'
import Step4Duration from './Step4_Duration.vue'
import Step5Results from './Step5_Results.vue'
import MotionStepShell from './motion/MotionStepShell.vue'
import PrototypeTickerBar from './PrototypeTickerBar.vue'

const { step, transitionDirection, resetFlow } = useWizard()

const clampedStep = computed(() => {
  return Math.min(5, Math.max(1, step.value))
})

const stepComponents: Record<number, Component> = {
  1: markRaw(Step1GoalSelection),
  2: markRaw(Step2TargetAmountType),
  3: markRaw(Step3CalculateAmount),
  4: markRaw(Step4Duration),
  5: markRaw(Step5Results),
}

const activeStepComponent = computed(() => stepComponents[clampedStep.value])
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

    <footer v-if="clampedStep < 5" class="py-8 text-center text-sm text-[#9FB6BC]">
      © 2026 DekaBank Deutsche Girozentrale
    </footer>
  </div>
</template>
