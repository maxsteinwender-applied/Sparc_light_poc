<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GoalData, GoalId } from './goalsData'
import ImageWithFallback from './figma/ImageWithFallback.vue'

const props = defineProps<{
  selectedGoalId: GoalId
  goals: GoalData[]
}>()

const emit = defineEmits<{
  (event: 'select', id: GoalId): void
}>()

const activeIndex = ref(0)

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
      style: {
        transform: `translateX(${x}px) scale(${scale}) rotateY(${rotateY}deg)`,
        opacity,
        zIndex,
      },
    }
  })
})
</script>

<template>
  <div class="relative mx-auto flex h-[400px] w-full max-w-[1200px] items-center justify-center overflow-hidden [perspective:1000px]">
    <button
      type="button"
      aria-label="Vorheriges Ziel"
      class="absolute left-4 z-[60] flex h-10 w-10 items-center justify-center border border-[#003745] bg-white text-[#003745] transition-colors hover:bg-[#F4F9FA] focus:outline-none focus:ring-2 focus:ring-[#0043B4] md:left-10"
      @click="handlePrev"
    >
      ‹
    </button>

    <button
      type="button"
      aria-label="Naechstes Ziel"
      class="absolute right-4 z-[60] flex h-10 w-10 items-center justify-center border border-[#003745] bg-white text-[#003745] transition-colors hover:bg-[#F4F9FA] focus:outline-none focus:ring-2 focus:ring-[#0043B4] md:right-10"
      @click="handleNext"
    >
      ›
    </button>

    <div class="relative flex h-full w-full items-center justify-center">
      <div
        v-for="card in cardStates"
        :key="card.goal.id"
        role="button"
        :tabindex="card.isVisible ? 0 : -1"
        :aria-label="`Ziel auswaehlen: ${card.goal.label}`"
        :aria-selected="card.isSelected"
        :style="card.style"
        class="absolute h-72 w-56 cursor-pointer overflow-hidden rounded-[4px] border border-[#003745]/20 bg-white shadow-xl transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0043B4] focus-visible:ring-offset-2"
        :class="card.isVisible ? 'visible pointer-events-auto' : 'invisible pointer-events-none'"
        @click="handleCardClick(card.index)"
        @keydown.enter.prevent="handleCardClick(card.index)"
        @keydown.space.prevent="handleCardClick(card.index)"
      >
        <div class="absolute inset-0 bg-[#F4F9FA]">
          <ImageWithFallback :src="card.goal.image" :alt="card.goal.label" class="h-full w-full object-cover" />
          <div class="absolute inset-0 transition-colors duration-300" :class="card.isSelected ? 'bg-[#003745]/10' : 'bg-black/10'" />
        </div>

        <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center bg-gradient-to-t from-[#003745]/95 via-[#003745]/80 to-transparent p-6 pt-20">
          <span class="text-center text-lg font-medium leading-tight text-white">{{ card.goal.label }}</span>
          <span
            v-if="card.isSelected"
            class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#003745] text-sm font-bold text-white shadow-lg"
          >
            ✓
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
