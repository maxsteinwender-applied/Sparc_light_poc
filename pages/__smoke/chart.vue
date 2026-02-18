<script setup lang="ts">
import Chart from 'primevue/chart'

const chartData = {
  labels: ['2026', '2027', '2028'],
  datasets: [
    {
      label: 'Sparrate',
      data: [1000, 3200, 6000],
      borderColor: '#003745',
      backgroundColor: 'rgba(0,55,69,0.15)',
      fill: true,
      tension: 0.35,
    },
  ],
}
</script>

<template>
  <section class="mx-auto max-w-3xl p-6">
    <h1 class="mb-4 text-2xl font-semibold text-[#003745]">Chart Smoke</h1>
    <Chart type="line" :data="chartData" class="rounded border border-[#E6EEF0] bg-white p-4" />
  </section>
</template>
