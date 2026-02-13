<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    message?: string
    speedSeconds?: number
    separator?: string
  }>(),
  {
    message: 'TESTUMGEBUNG: Diese Lösung ist ein Prototyp und nicht für produktive Nutzung bestimmt.',
    speedSeconds: 24,
    separator: ' • ',
  },
)

const repeatedMessage = computed(() => `${props.message}${props.separator}`)
const tickerDuration = computed(() => `${Math.max(6, props.speedSeconds)}s`)
</script>

<template>
  <div
    class="flex h-[var(--prototype-ticker-height)] items-center overflow-hidden bg-[#EE0000] text-white"
    role="status"
    aria-live="polite"
  >
    <p class="sr-only">{{ props.message }}</p>

    <div class="w-full overflow-hidden whitespace-nowrap" aria-hidden="true">
      <div class="prototype-ticker-track" :style="{ '--prototype-ticker-duration': tickerDuration }">
        <span class="prototype-ticker-item">{{ repeatedMessage }}</span>
        <span class="prototype-ticker-item">{{ repeatedMessage }}</span>
      </div>
    </div>
  </div>
</template>
