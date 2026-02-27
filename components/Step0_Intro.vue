<script setup lang="ts">
import { ref } from 'vue'
import { useWizard } from '../composables/useWizard'

const { setStep } = useWizard()

const heroImageSrc = '/images/intro/Image intro.png'
const hasHeroImage = ref(true)

const floatingGoalIcons = [
  { icon: 'home', size: 62, top: '-3%', left: '8%', delay: '0s', duration: '6.4s' },
  { icon: 'directions_car', size: 56, top: '8%', left: '85%', delay: '1.3s', duration: '7.2s' },
  { icon: 'flight', size: 52, top: '68%', left: '2%', delay: '0.8s', duration: '6.9s' },
  { icon: 'trending_up', size: 66, top: '91%', left: '30%', delay: '0.4s', duration: '8s' },
]

const highlights = [
  'In wenigen Minuten zum persönlichen Ergebnis',
  'Keine Registrierung erforderlich',
  'Unverbindliche Orientierung',
]

const handleContinue = () => {
  setStep(1)
}

const handleHeroImageError = () => {
  hasHeroImage.value = false
}
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 md:pt-12">
    <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
      <section class="max-w-[560px]">
        <p class="mb-4 text-[20px] font-bold uppercase tracking-normal text-[#EE0000]">Sparplan Wizard</p>
        <h1 class="text-[48px] font-normal leading-[1.15] text-[#003745]">
          Aus einem Sparziel einen klaren Plan machen.
        </h1>
        <p class="mt-5 max-w-[52ch] text-[20px] leading-relaxed text-[#003745]">
          Wir zeigen Ihnen in wenigen Schritten, wie aus Ihrem Ziel ein realistischer Sparplan wird – verständlich und ohne Fachsprache.
        </p>

        <ul class="mt-7 space-y-2.5 text-[20px] text-[#003745]">
          <li v-for="entry in highlights" :key="entry" class="flex items-start gap-2.5">
            <span class="mt-[0.6em] inline-block h-2 w-2 bg-[#EE0000]" aria-hidden="true" />
            <span>{{ entry }}</span>
          </li>
        </ul>

        <button
          type="button"
          class="ui-button ui-button-primary motion-cta mt-9 h-auto min-w-[290px] px-10 py-4 text-lg"
          @click="handleContinue"
        >
          Sparziel berechnen
        </button>
      </section>

      <section class="relative">
        <div class="relative mx-auto aspect-[5/4] w-full max-w-[760px] overflow-visible">
          <div class="absolute right-0 top-[12%] z-[2] h-[74%] w-[78%] overflow-hidden rounded-none shadow-[0_16px_40px_rgba(0,55,69,0.12)]">
            <img
              v-if="hasHeroImage"
              :src="heroImageSrc"
              alt="Sparplan Vorschau"
              class="h-full w-full object-cover"
              @error="handleHeroImageError"
            >
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-white/70 text-[#7F949C]"
              aria-label="Bildplatzhalter"
            >
              <span class="material-symbols-outlined text-[56px]" aria-hidden="true">image</span>
            </div>
          </div>

          <div
            v-for="entry in floatingGoalIcons"
            :key="`${entry.icon}-${entry.top}-${entry.left}`"
            class="floating-goal-icon"
            :style="{
              top: entry.top,
              left: entry.left,
              width: `${entry.size}px`,
              height: `${entry.size}px`,
              animationDelay: entry.delay,
              animationDuration: entry.duration,
            }"
            aria-hidden="true"
          >
            <span class="material-symbols-outlined" :style="{ fontSize: `${Math.round(entry.size * 0.46)}px` }">{{ entry.icon }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.floating-goal-icon {
  position: absolute;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-control);
  background: #1a6b80;
  color: #ffffff;
  opacity: 1;
  box-shadow: 0 8px 24px rgba(0, 55, 69, 0.16);
  animation-name: float-y;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes float-y {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-goal-icon {
    animation: none;
  }
}
</style>
