import type { MotionVariants, Transition, Variant } from '@vueuse/motion'

export type MotionPresetName =
  | 'stepForward'
  | 'stepBackward'
  | 'fadeUp'
  | 'staggerItem'
  | 'modalBackdrop'
  | 'modalPanel'

type AppMotionVariants = MotionVariants<string>

const EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1]

const toSeconds = (durationMs: number): number => durationMs / 1000

const buildTween = (
  durationMs: number,
  delayMs = 0,
  ease: Transition['ease'] = EASE_STANDARD,
): Transition => ({
  type: 'tween',
  duration: toSeconds(durationMs),
  delay: toSeconds(delayMs),
  ease,
})

const cloneVariant = (variant?: Variant): Variant | undefined => {
  if (!variant) {
    return undefined
  }

  return {
    ...variant,
    transition: variant.transition ? { ...variant.transition } : undefined,
  }
}

const cloneMotionVariants = (variants: AppMotionVariants): AppMotionVariants => {
  const cloned: AppMotionVariants = {}

  Object.entries(variants).forEach(([key, value]) => {
    cloned[key] = cloneVariant(value as Variant)
  })

  return cloned
}

const reducedFadeVariants: AppMotionVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: buildTween(120, 0, 'linear'),
  },
  leave: {
    opacity: 0,
    transition: buildTween(100, 0, 'linear'),
  },
}

export const MOTION_PRESETS: Record<MotionPresetName, AppMotionVariants> = {
  stepForward: {
    initial: {
      opacity: 0,
      x: 24,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: buildTween(260),
    },
    leave: {
      opacity: 0,
      x: -18,
      transition: buildTween(220),
    },
  },
  stepBackward: {
    initial: {
      opacity: 0,
      x: -24,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: buildTween(260),
    },
    leave: {
      opacity: 0,
      x: 18,
      transition: buildTween(220),
    },
  },
  fadeUp: {
    initial: {
      opacity: 0,
      y: 12,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: buildTween(260),
    },
    leave: {
      opacity: 0,
      y: 6,
      transition: buildTween(180),
    },
  },
  staggerItem: {
    initial: {
      opacity: 0,
      y: 12,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: buildTween(260),
    },
    leave: {
      opacity: 0,
      y: 6,
      transition: buildTween(180),
    },
  },
  modalBackdrop: {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: buildTween(180),
    },
    leave: {
      opacity: 0,
      transition: buildTween(120),
    },
  },
  modalPanel: {
    initial: {
      opacity: 0,
      y: 18,
      scale: 0.98,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: buildTween(260),
    },
    leave: {
      opacity: 0,
      y: 10,
      scale: 0.99,
      transition: buildTween(180),
    },
  },
}

export const getStepVariants = (
  direction: 1 | -1,
  reducedMotion: boolean,
): AppMotionVariants => {
  if (reducedMotion) {
    return cloneMotionVariants(reducedFadeVariants)
  }

  return cloneMotionVariants(
    direction === 1 ? MOTION_PRESETS.stepForward : MOTION_PRESETS.stepBackward,
  )
}

export const getStaggerItemVariants = (
  index: number,
  reducedMotion: boolean,
): AppMotionVariants => {
  const variants = cloneMotionVariants(
    reducedMotion ? reducedFadeVariants : MOTION_PRESETS.staggerItem,
  )
  const delayMs = reducedMotion ? 0 : index * 35

  if (variants.enter?.transition) {
    variants.enter.transition = {
      ...variants.enter.transition,
      delay: toSeconds(delayMs),
    }
  }

  return variants
}

export const getFadeUpVariants = (reducedMotion: boolean): AppMotionVariants =>
  cloneMotionVariants(reducedMotion ? reducedFadeVariants : MOTION_PRESETS.fadeUp)

export const getModalBackdropVariants = (
  reducedMotion: boolean,
): AppMotionVariants =>
  cloneMotionVariants(
    reducedMotion
      ? {
          ...reducedFadeVariants,
        }
      : MOTION_PRESETS.modalBackdrop,
  )

export const getModalPanelVariants = (
  reducedMotion: boolean,
): AppMotionVariants =>
  cloneMotionVariants(
    reducedMotion
      ? {
          ...reducedFadeVariants,
        }
      : MOTION_PRESETS.modalPanel,
  )
