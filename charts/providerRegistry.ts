import type { ChartProviderName } from './types'

const SUPPORTED_PROVIDERS: ChartProviderName[] = ['echarts', 'highcharts']

const normalizeProviderName = (
  value: string | undefined,
  highchartsEnabled: boolean,
): ChartProviderName => {
  const normalized = value?.toLowerCase().trim()
  if (!SUPPORTED_PROVIDERS.includes(normalized as ChartProviderName)) {
    return 'echarts'
  }

  if (normalized === 'highcharts' && !highchartsEnabled) {
    return 'echarts'
  }

  return normalized as ChartProviderName
}

export const resolveChartProvider = (
  override?: ChartProviderName,
  configuredProvider?: string,
  highchartsEnabled = false,
): ChartProviderName => {
  if (override) {
    return normalizeProviderName(override, highchartsEnabled)
  }

  return normalizeProviderName(configuredProvider, highchartsEnabled)
}
