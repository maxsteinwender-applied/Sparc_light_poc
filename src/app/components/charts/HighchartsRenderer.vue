<script setup lang="ts">
import Highcharts from 'highcharts'
import { Chart } from 'highcharts-vue'
import type { Options } from 'highcharts'

defineProps<{
  options: Options
}>()
</script>

<template>
  <Chart :highcharts="Highcharts" :options="options" />
</template>
