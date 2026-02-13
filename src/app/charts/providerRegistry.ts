import type { ChartProviderName } from './types'

const SUPPORTED_PROVIDERS: ChartProviderName[] = ['echarts', 'highcharts']

const normalizeProviderName = (value: string | undefined): ChartProviderName => {
  const normalized = value?.toLowerCase().trim()
  return SUPPORTED_PROVIDERS.includes(normalized as ChartProviderName)
    ? (normalized as ChartProviderName)
    : 'echarts'
}

export const resolveChartProvider = (
  override?: ChartProviderName,
): ChartProviderName => {
  if (override) {
    return normalizeProviderName(override)
  }

  return normalizeProviderName(import.meta.env.VITE_CHART_PROVIDER)
}
