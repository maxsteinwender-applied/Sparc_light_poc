<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
    label?: string
    unit?: string
    note?: string
    helpText?: string
    min?: number
    max?: number
    step?: number
    decrementLabel?: string
    incrementLabel?: string
  }>(),
  {
    label: '',
    unit: '',
    note: '',
    helpText: '',
    min: 0,
    max: 100,
    step: 1,
    decrementLabel: 'Wert verringern',
    incrementLabel: 'Wert erhöhen',
  },
)

const emit = defineEmits<{
  (event: 'update:value', value: number): void
}>()

const handleDecrement = () => {
  if (props.value <= props.min) {
    return
  }

  emit('update:value', Math.max(props.min, props.value - props.step))
}

const handleIncrement = () => {
  if (props.value >= props.max) {
    return
  }

  emit('update:value', Math.min(props.max, props.value + props.step))
}
</script>

<template>
  <div class="flex w-full flex-col">
    <span v-if="props.label" class="ui-text-secondary mb-[4px] block text-[12px] font-normal">
      {{ props.label }}
    </span>

    <div class="flex h-14 items-center overflow-hidden rounded-none border border-[#003745] bg-[#FFFFFF]">
      <button
        type="button"
        :disabled="props.value <= props.min"
        class="ui-button-ghost flex h-full w-[56px] items-center justify-center border-r border-[#003745] bg-transparent text-[32px] leading-none text-[#003745] disabled:opacity-50"
        :aria-label="props.decrementLabel"
        @click="handleDecrement"
      >
        <span aria-hidden="true">−</span>
      </button>

      <div class="flex min-w-0 flex-grow items-center justify-between px-4">
        <span class="text-left text-[18px] font-normal leading-none text-[#003745]">
          {{ props.value }}
        </span>
        <span v-if="props.unit" class="text-right text-[16px] font-bold text-[#1A6B80]">
          {{ props.unit }}
        </span>
      </div>

      <button
        type="button"
        :disabled="props.value >= props.max"
        class="ui-button-ghost flex h-full w-[56px] items-center justify-center border-l border-[#003745] bg-transparent text-[32px] leading-none text-[#003745] disabled:opacity-50"
        :aria-label="props.incrementLabel"
        @click="handleIncrement"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>

    <span v-if="props.note" class="ui-text-secondary mt-[4px] block text-[12px] font-normal">
      {{ props.note }}
    </span>
    <span v-if="props.helpText" class="ui-text-secondary mt-[4px] block text-[12px]">
      {{ props.helpText }}
    </span>
  </div>
</template>
