import { computed } from 'vue'
import { useReducedMotion } from '@vueuse/motion'
import type { Transition } from '@vueuse/motion'

export const useMotionSafety = () => {
  const prefersReducedMotion = useReducedMotion()

  const springTransition = computed<Transition>(() => {
    if (prefersReducedMotion.value) {
      return {
        type: 'tween',
        duration: 0.12,
        ease: 'linear',
      }
    }

    return {
      type: 'spring',
      stiffness: 220,
      damping: 24,
      mass: 0.9,
    }
  })

  return {
    prefersReducedMotion,
    springTransition,
  }
}
