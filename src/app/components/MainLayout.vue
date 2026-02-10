<script setup lang="ts">
import { computed } from 'vue'
import dekaLogoImage from '@/assets/e088cf5e6488ed30341523cb4f504779a4587bd6.png'
import { useWizard } from '../composables/useWizard'
import Step1GoalSelection from './Step1_GoalSelection.vue'
import Step2TargetAmountType from './Step2_TargetAmountType.vue'
import Step3CalculateAmount from './Step3_CalculateAmount.vue'
import Step4Duration from './Step4_Duration.vue'
import Step5Results from './Step5_Results.vue'

const { step, setStep, resetFlow } = useWizard()

const clampedStep = computed(() => {
  return Math.min(5, Math.max(1, step.value))
})

const goBack = () => {
  setStep(Math.max(1, clampedStep.value - 1))
}

const goNext = () => {
  setStep(Math.min(5, clampedStep.value + 1))
}
</script>

<template>
  <div class="min-h-screen bg-white text-[#003745] font-sans selection:bg-[#EE0000] selection:text-white">
    <header class="sticky top-0 z-50 border-b border-[#E6EEF0] bg-white">
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
              'h-1.5 rounded-full transition-all duration-300',
              clampedStep >= progressStep ? 'w-8 bg-[#003745]' : 'w-2 bg-[#003745]/25',
            ]"
          />
        </div>
      </div>
    </header>

    <main class="w-full">
      <Step1GoalSelection v-if="clampedStep === 1" />
      <Step2TargetAmountType v-else-if="clampedStep === 2" />
      <Step3CalculateAmount v-else-if="clampedStep === 3" />
      <Step4Duration v-else-if="clampedStep === 4" />
      <Step5Results v-else-if="clampedStep === 5" />

      <section v-else class="mx-auto mt-12 w-full max-w-5xl rounded-[4px] border border-[#003745]/15 bg-white p-8 shadow-sm">
        <p class="mb-2 text-sm font-medium uppercase tracking-widest text-[#EE0000]">Schritt {{ clampedStep }} von 5</p>
        <h1 class="mb-3 text-3xl font-bold text-[#003745]">Dieser Schritt wird als Naechstes portiert.</h1>
        <p class="mb-8 text-base text-[#568996]">
          Schritt 1 ist bereits als Vue-Komponente aktiv. Die weiteren Schritte folgen in den naechsten Migrationsschritten.
        </p>

        <div class="grid gap-4 md:grid-cols-2">
          <button
            class="rounded-[4px] border border-[#003745]/20 px-4 py-3 text-left text-sm font-medium text-[#003745] transition-colors hover:border-[#003745]"
            type="button"
            @click="goBack"
          >
            Vorheriger Schritt
          </button>
          <button
            class="rounded-[4px] border border-[#003745]/20 px-4 py-3 text-left text-sm font-medium text-[#003745] transition-colors hover:border-[#003745]"
            type="button"
            @click="goNext"
          >
            Naechster Schritt
          </button>
        </div>
      </section>
    </main>

    <footer v-if="clampedStep < 5" class="py-8 text-center text-sm text-[#9FB6BC]">
      © 2026 DekaBank Deutsche Girozentrale
    </footer>
  </div>
</template>
