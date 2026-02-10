<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMotion } from '@vueuse/motion'
import type { GoalData } from '../goalsData'
import ImageWithFallback from '../figma/ImageWithFallback.vue'
import { useMotionSafety } from '../../motion/useMotionSafety'

interface CardMotionState {
  x: number
  scale: number
  opacity: number
  zIndex: number
  rotateY: number
}

const props = defineProps<{
  goal: GoalData
  index: number
  isSelected: boolean
  isVisible: boolean
  motionState: CardMotionState
}>()

const emit = defineEmits<{
  (event: 'select', index: number): void
}>()

const cardRef = ref<HTMLElement | null>(null)
const { prefersReducedMotion, springTransition } = useMotionSafety()

const cardMotion = useMotion(
  cardRef,
  {
    initial: {
      x: props.motionState.x,
      scale: props.motionState.scale,
      rotateY: props.motionState.rotateY,
      opacity: props.motionState.opacity,
    },
  },
  {
    syncVariants: false,
    lifeCycleHooks: false,
    eventListeners: false,
    visibilityHooks: false,
  },
)

const applyMotionState = () => {
  cardMotion.apply({
    x: props.motionState.x,
    scale: props.motionState.scale,
    rotateY: prefersReducedMotion.value ? 0 : props.motionState.rotateY,
    opacity: props.motionState.opacity,
    transition: springTransition.value,
  })
}

watch(
  () => [
    props.motionState.x,
    props.motionState.scale,
    props.motionState.rotateY,
    props.motionState.opacity,
    prefersReducedMotion.value,
  ],
  () => {
    applyMotionState()
  },
  { immediate: true },
)

watch(cardRef, (nextElement) => {
  if (!nextElement) {
    return
  }

  applyMotionState()
})

const cardStyle = computed(() => ({
  zIndex: props.motionState.zIndex,
}))

const handleSelect = () => {
  emit('select', props.index)
}
</script>

<template>
  <div
    ref="cardRef"
    role="button"
    :tabindex="isVisible ? 0 : -1"
    :aria-label="`Ziel auswaehlen: ${goal.label}`"
    :aria-selected="isSelected"
    :style="cardStyle"
    class="motion-carousel-card absolute h-72 w-56 cursor-pointer overflow-hidden rounded-[4px] border border-[#003745]/20 bg-white shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0043B4] focus-visible:ring-offset-2"
    :class="isVisible ? 'visible pointer-events-auto' : 'invisible pointer-events-none'"
    @click="handleSelect"
    @keydown.enter.prevent="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <div class="absolute inset-0 bg-[#F4F9FA]">
      <ImageWithFallback :src="goal.image" :alt="goal.label" class="h-full w-full object-cover" />
      <div class="absolute inset-0 transition-colors duration-300" :class="isSelected ? 'bg-[#003745]/10' : 'bg-black/10'" />
    </div>

    <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center bg-gradient-to-t from-[#003745]/95 via-[#003745]/80 to-transparent p-6 pt-20">
      <span class="text-center text-lg font-medium leading-tight text-white">{{ goal.label }}</span>
      <span
        v-if="isSelected"
        class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#003745] text-sm font-bold text-white shadow-lg"
      >
        ✓
      </span>
    </div>
  </div>
</template>
