export type ChartProviderName = 'echarts' | 'highcharts'

export type ChartSeriesStyleRole = 'projection' | 'baseline' | 'invested'

export interface ChartPoint {
  x: number
  y: number
}

export interface ChartSeries {
  id: string
  label: string
  points: ChartPoint[]
  styleRole: ChartSeriesStyleRole
}

export interface ChartThemeTokens {
  background: string
  text: string
  grid: string
  projection: string
  baseline: string
  invested: string
}

export interface ProjectionChartModel {
  title: string
  xAxisLabel: string
  yAxisLabel: string
  series: ChartSeries[]
}
