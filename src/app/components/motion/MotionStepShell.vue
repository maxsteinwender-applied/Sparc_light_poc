<script setup lang="ts">
import { computed } from 'vue'
import { getStepVariants } from '../../motion/presets'
import { useMotionSafety } from '../../motion/useMotionSafety'

const props = defineProps<{
  direction: 1 | -1
}>()

const { prefersReducedMotion } = useMotionSafety()

const variants = computed(() =>
  getStepVariants(props.direction, prefersReducedMotion.value),
)
</script>

<template>
  <div
    v-motion
    :initial="variants.initial"
    :enter="variants.enter"
    :leave="variants.leave"
    class="motion-step-shell w-full will-change-transform"
  >
    <slot />
  </div>
</template>
