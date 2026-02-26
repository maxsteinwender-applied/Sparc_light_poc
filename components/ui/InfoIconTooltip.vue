<script setup lang="ts">
interface Props {
  text: string
  buttonLabel: string
  tooltipId: string
}

defineProps<Props>()

const handleEscape = (event: KeyboardEvent) => {
  const trigger = event.currentTarget as HTMLButtonElement | null
  trigger?.blur()
}
</script>

<template>
  <span class="group relative inline-flex">
    <button
      type="button"
      :aria-label="buttonLabel"
      :aria-describedby="tooltipId"
      class="inline-flex h-5 w-5 items-center justify-center rounded-[2px] text-[var(--text-secondary)] transition-colors hover:text-[#003745] focus-visible:text-[#003745]"
      @keydown.esc.prevent="handleEscape"
    >
      <span class="material-symbols-outlined text-[16px]" aria-hidden="true">info</span>
    </button>
    <span
      :id="tooltipId"
      role="tooltip"
      class="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[4px] border border-[#D3DEE3] bg-white p-3 text-left text-xs leading-relaxed text-[#003745] opacity-0 shadow-[0_8px_24px_rgba(0,55,69,0.16)] transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
    >
      {{ text }}
    </span>
  </span>
</template>
