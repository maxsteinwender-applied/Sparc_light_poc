<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    message?: string
    speedSeconds?: number
    separator?: string
  }>(),
  {
    message: 'TESTUMGEBUNG: Diese Lösung ist ein Prototyp und nicht für produktive Nutzung bestimmt',
    speedSeconds: 24,
    separator: '•',
  },
)

const viewportRef = ref<HTMLElement | null>(null)
const sampleItemRef = ref<HTMLElement | null>(null)
const copiesPerSet = ref(6)

const tickerDuration = computed(() => `${Math.max(6, props.speedSeconds)}s`)
const copies = computed(() => Array.from({ length: copiesPerSet.value }, (_, index) => index))

let resizeObserver: ResizeObserver | null = null

const recomputeCopies = () => {
  const viewportWidth = viewportRef.value?.clientWidth ?? 0
  const sampleWidth = sampleItemRef.value?.offsetWidth ?? 0

  if (viewportWidth <= 0 || sampleWidth <= 0) {
    copiesPerSet.value = 6
    return
  }

  copiesPerSet.value = Math.max(4, Math.ceil(viewportWidth / sampleWidth) + 2)
}

onMounted(async () => {
  await nextTick()
  recomputeCopies()

  resizeObserver = new ResizeObserver(() => {
    recomputeCopies()
  })

  if (viewportRef.value) {
    resizeObserver.observe(viewportRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(
  () => [props.message, props.separator],
  async () => {
    await nextTick()
    recomputeCopies()
  },
)
</script>

<template>
  <div
    class="relative flex h-[var(--prototype-ticker-height)] items-center overflow-hidden bg-[#EE0000] text-white"
    role="status"
    aria-live="polite"
  >
    <p class="sr-only">{{ props.message }}</p>

    <div ref="viewportRef" class="prototype-ticker-viewport w-full overflow-hidden whitespace-nowrap text-[12px]" aria-hidden="true">
      <div class="prototype-ticker-track" :style="{ '--prototype-ticker-duration': tickerDuration }">
        <div class="prototype-ticker-group">
          <span v-for="copyIndex in copies" :key="`set-a-${copyIndex}`" class="prototype-ticker-item">
            <span>{{ props.message }}</span>
            <span class="prototype-ticker-separator" aria-hidden="true">{{ props.separator }}</span>
          </span>
        </div>
        <div class="prototype-ticker-group">
          <span v-for="copyIndex in copies" :key="`set-b-${copyIndex}`" class="prototype-ticker-item">
            <span>{{ props.message }}</span>
            <span class="prototype-ticker-separator" aria-hidden="true">{{ props.separator }}</span>
          </span>
        </div>
      </div>
    </div>

    <span ref="sampleItemRef" class="prototype-ticker-item prototype-ticker-item--measure">
      <span>{{ props.message }}</span>
      <span class="prototype-ticker-separator" aria-hidden="true">{{ props.separator }}</span>
    </span>

    <div class="prototype-ticker-fade-left pointer-events-none absolute inset-y-0 left-0 w-8" aria-hidden="true" />
    <div class="prototype-ticker-fade-right pointer-events-none absolute inset-y-0 right-0 w-8" aria-hidden="true" />
  </div>
</template>
