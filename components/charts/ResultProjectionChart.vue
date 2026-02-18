<script setup lang="ts">
import { computed, onErrorCaptured, ref, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import type { Options as HighchartsOptions } from 'highcharts'
import type { SavingsProjectionPoint } from '../../domain/savingsPlan'
import { mapSavingsProjectionToSeries } from '../../charts/mappers/savingsProjectionToSeries'
import { resolveChartProvider } from '../../charts/providerRegistry'
import { buildEchartsOptions } from '../../charts/providers/echarts'
import { buildHighchartsOptions } from '../../charts/providers/highcharts'
import { resolveChartThemeTokens } from '../../charts/theme'
import type { ProjectionChartModel } from '../../charts/types'
import EchartsRenderer from './EchartsRenderer.vue'
import HighchartsRenderer from './HighchartsRenderer.vue'

const props = withDefaults(
  defineProps<{
    chartData: SavingsProjectionPoint[]
    title?: string
    provider?: 'echarts' | 'highcharts'
  }>(),
  {
    title: 'Entwicklung im Zeitverlauf',
    provider: undefined,
  },
)

const rendererError = ref(false)
const runtimeConfig = useRuntimeConfig()
const configuredProvider = computed(() =>
  resolveChartProvider(props.provider, runtimeConfig.public.chartProvider as string | undefined),
)
const runtimeProvider = ref<'echarts' | 'highcharts'>(configuredProvider.value)
const themeTokens = computed(() => resolveChartThemeTokens())

const model = computed<ProjectionChartModel>(() => ({
  title: props.title,
  xAxisLabel: 'Jahr',
  yAxisLabel: 'Betrag (EUR)',
  series: mapSavingsProjectionToSeries(props.chartData),
}))

const highchartsOptions = computed<HighchartsOptions>(() =>
  buildHighchartsOptions(model.value, themeTokens.value),
)
const echartsOptions = computed<EChartsOption>(() =>
  buildEchartsOptions(model.value, themeTokens.value),
)

onErrorCaptured(() => {
  if (runtimeProvider.value === 'highcharts') {
    runtimeProvider.value = 'echarts'
    rendererError.value = false
    return false
  }

  rendererError.value = true
  return false
})

watch(configuredProvider, (nextProvider) => {
  runtimeProvider.value = nextProvider
  rendererError.value = false
})
</script>

<template>
  <section class="rounded-[4px] border border-[#003745]/10 bg-white p-4 md:p-6" aria-label="Ergebnisdiagramm">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h3 class="text-lg font-bold text-[#003745]">{{ title }}</h3>
      <span class="rounded-full border border-[#E6EEF0] bg-[#F4F9FA] px-2.5 py-1 text-xs font-medium text-[#568996]">
        {{ runtimeProvider === 'highcharts' ? 'Highcharts' : 'ECharts' }}
      </span>
    </div>

    <div v-if="rendererError" class="rounded-[4px] border border-[#E6EEF0] bg-[#F4F9FA] p-4 text-sm text-[#568996]">
      Diagramm konnte nicht gerendert werden. Die Tabellendarstellung darunter bleibt verfügbar.
    </div>

    <ClientOnly v-else>
      <HighchartsRenderer
        v-if="runtimeProvider === 'highcharts'"
        :options="highchartsOptions"
      />
      <EchartsRenderer v-else :options="echartsOptions" />
      <template #fallback>
        <div class="rounded-[4px] border border-[#E6EEF0] bg-[#F4F9FA] p-4 text-sm text-[#568996]">
          Diagramm wird geladen.
        </div>
      </template>
    </ClientOnly>
  </section>
</template>
