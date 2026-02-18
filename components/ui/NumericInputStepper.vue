<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
    label?: string
    unit?: string
    note?: string
    min?: number
    max?: number
    step?: number
  }>(),
  {
    label: '',
    unit: '',
    note: '',
    min: 0,
    max: 100,
    step: 1,
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
    <span v-if="props.label" class="mb-[4px] block text-[12px] font-normal text-[#568996]">
      {{ props.label }}
    </span>

    <div class="flex h-[40px] items-center overflow-hidden rounded-[4px] border border-[#003745] bg-[#FFFFFF]">
      <button
        type="button"
        :disabled="props.value <= props.min"
        class="flex h-full w-[40px] items-center justify-center bg-transparent text-[#003745] focus:outline-none disabled:opacity-50"
        @click="handleDecrement"
      >
        -
      </button>

      <div class="flex flex-grow items-center justify-center gap-[6px]">
        <span class="text-[16px] font-semibold text-[#003745]">
          {{ props.value }}
        </span>
        <span v-if="props.unit" class="text-[14px] font-semibold text-[#003745]">
          {{ props.unit }}
        </span>
      </div>

      <button
        type="button"
        :disabled="props.value >= props.max"
        class="flex h-full w-[40px] items-center justify-center bg-transparent text-[#003745] focus:outline-none disabled:opacity-50"
        @click="handleIncrement"
      >
        +
      </button>
    </div>

    <span v-if="props.note" class="mt-[4px] block text-[12px] font-normal text-[#568996]">
      {{ props.note }}
    </span>
  </div>
</template>
