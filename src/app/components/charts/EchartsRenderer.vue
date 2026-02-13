<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  LineChart,
  TitleComponent,
  TooltipComponent,
])

defineProps<{
  options: EChartsOption
}>()
</script>

<template>
  <VChart class="h-[360px] w-full" :option="options" autoresize />
</template>
