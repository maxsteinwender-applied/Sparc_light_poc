<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GoalData, GoalId } from './goalsData'
import MotionGoalCard from './motion/MotionGoalCard.vue'

const props = defineProps<{
  selectedGoalId: GoalId
  goals: GoalData[]
}>()

const emit = defineEmits<{
  (event: 'select', id: GoalId): void
}>()

const activeIndex = ref(0)
const touchStartX = ref<number | null>(null)
const touchStartY = ref<number | null>(null)

const syncActiveIndexFromProp = () => {
  const indexFromProp = props.goals.findIndex((goal) => goal.id === props.selectedGoalId)
  activeIndex.value = indexFromProp >= 0 ? indexFromProp : 0
}

watch(
  () => props.selectedGoalId,
  () => {
    syncActiveIndexFromProp()
  },
  { immediate: true },
)

watch(
  () => props.goals,
  () => {
    syncActiveIndexFromProp()
  },
  { deep: true },
)

watch(activeIndex, (nextIndex) => {
  const goal = props.goals[nextIndex]
  if (!goal || goal.id === props.selectedGoalId) {
    return
  }

  emit('select', goal.id)
})

const handlePrev = () => {
  const total = props.goals.length
  if (total === 0) {
    return
  }

  activeIndex.value = (activeIndex.value - 1 + total) % total
}

const handleNext = () => {
  const total = props.goals.length
  if (total === 0) {
    return
  }

  activeIndex.value = (activeIndex.value + 1) % total
}

const handleCardClick = (index: number) => {
  activeIndex.value = index
  const goal = props.goals[index]
  if (goal) {
    emit('select', goal.id)
  }
}

const cardStates = computed(() => {
  const total = props.goals.length

  return props.goals.map((goal, index) => {
    let offset = index - activeIndex.value
    if (offset > total / 2) {
      offset -= total
    }
    if (offset < -total / 2) {
      offset += total
    }

    const absOffset = Math.abs(offset)
    const isSelected = offset === 0
    const isVisible = absOffset <= 2

    let x = 0
    let scale = 0.5
    let opacity = 0
    let zIndex = 0
    let rotateY = 0

    if (isSelected) {
      x = 0
      scale = 1
      opacity = 1
      zIndex = 50
      rotateY = 0
    } else if (absOffset === 1) {
      x = offset * 240
      scale = 0.9
      opacity = 0.75
      zIndex = 40
      rotateY = offset > 0 ? -15 : 15
    } else if (absOffset === 2) {
      x = offset * 420
      scale = 0.8
      opacity = 0.5
      zIndex = 30
      rotateY = offset > 0 ? -25 : 25
    }

    return {
      goal,
      index,
      isSelected,
      isVisible,
      motionState: {
        x,
        scale,
        opacity,
        zIndex,
        rotateY,
      },
    }
  })
})

const selectedGoalOptionId = computed(() => {
  const selectedGoal = props.goals[activeIndex.value]
  return selectedGoal ? `goal-option-${selectedGoal.id}` : undefined
})

const totalGoals = computed(() => props.goals.length)
const indicatorPosition = computed(() => {
  if (totalGoals.value === 0) {
    return 0
  }

  return activeIndex.value + 1
})

const handleTouchStart = (event: TouchEvent) => {
  const touch = event.changedTouches[0]
  if (!touch) {
    return
  }

  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
}

const handleTouchEnd = (event: TouchEvent) => {
  const touch = event.changedTouches[0]
  if (!touch || touchStartX.value === null || touchStartY.value === null) {
    return
  }

  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value
  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)

  touchStartX.value = null
  touchStartY.value = null

  if (absDeltaX < 36 || absDeltaX <= absDeltaY) {
    return
  }

  if (deltaX < 0) {
    handleNext()
    return
  }

  handlePrev()
}
</script>

<template>
  <div
    class="relative mx-auto flex h-[440px] w-full max-w-[1200px] items-center justify-center overflow-hidden [perspective:1000px]"
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
  >
    <button
      type="button"
      aria-label="Vorheriges Ziel"
      class="ui-button ui-button-secondary absolute left-4 z-[60] flex h-11 w-11 items-center justify-center md:left-10"
      @click="handlePrev"
    >
      ‹
    </button>

    <button
      type="button"
      aria-label="Nächstes Ziel"
      class="ui-button ui-button-secondary absolute right-4 z-[60] flex h-11 w-11 items-center justify-center md:right-10"
      @click="handleNext"
    >
      ›
    </button>

    <div
      class="relative flex h-full w-full items-center justify-center"
      role="listbox"
      aria-label="Sparziel auswählen"
      :aria-activedescendant="selectedGoalOptionId"
    >
      <MotionGoalCard
        v-for="card in cardStates"
        :key="card.goal.id"
        :option-id="`goal-option-${card.goal.id}`"
        :goal="card.goal"
        :index="card.index"
        :is-selected="card.isSelected"
        :is-visible="card.isVisible"
        :motion-state="card.motionState"
        @select="handleCardClick"
      />
    </div>

    <div class="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
      <div class="rounded-full border border-[#003745]/20 bg-white/90 px-3 py-1 text-xs font-medium text-[#003745]">
        {{ indicatorPosition }} von {{ totalGoals }}
      </div>
      <div class="flex items-center gap-1.5" aria-hidden="true">
        <span
          v-for="goal in props.goals"
          :key="goal.id"
          class="h-1.5 rounded-full transition-all duration-200"
          :class="goal.id === props.selectedGoalId ? 'w-5 bg-[#003745]' : 'w-1.5 bg-[#003745]/25'"
        />
      </div>
      <p class="ui-text-secondary pb-1 text-xs md:hidden">Wischen oder tippen, um ein Ziel auszuwählen</p>
    </div>
  </div>
</template>
