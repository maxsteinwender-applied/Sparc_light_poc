import type { EChartsOption } from 'echarts'
import type { ProjectionChartModel, ChartThemeTokens } from '../types'

export const buildEchartsOptions = (
  model: ProjectionChartModel,
  theme: ChartThemeTokens,
): EChartsOption => {
  return {
    backgroundColor: theme.background,
    textStyle: {
      color: theme.text,
    },
    title: {
      text: model.title,
      left: 'left',
      textStyle: {
        color: theme.text,
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) =>
        typeof value === 'number'
          ? `${Math.round(value).toLocaleString('de-DE')} EUR`
          : `${value}`,
    },
    legend: {
      top: 28,
      textStyle: {
        color: theme.text,
      },
    },
    grid: {
      left: 32,
      right: 20,
      top: 72,
      bottom: 30,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      name: model.xAxisLabel,
      nameLocation: 'middle',
      nameGap: 28,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: theme.grid },
      },
      axisLabel: {
        color: theme.text,
      },
      data: model.series[0]?.points.map((point) => point.x) ?? [],
    },
    yAxis: {
      type: 'value',
      name: model.yAxisLabel,
      axisLine: {
        lineStyle: { color: theme.grid },
      },
      splitLine: {
        lineStyle: {
          color: theme.grid,
        },
      },
      axisLabel: {
        color: theme.text,
        formatter: (value: number) => `${Math.round(value).toLocaleString('de-DE')} €`,
      },
    },
    series: model.series.map((series) => ({
      name: series.label,
      type: 'line',
      showSymbol: false,
      smooth: false,
      data: series.points.map((point) => point.y),
      lineStyle: {
        width: series.styleRole === 'projection' ? 3 : 2,
        type:
          series.styleRole === 'baseline'
            ? 'dashed'
            : series.styleRole === 'invested'
              ? 'dotted'
              : 'solid',
        color:
          series.styleRole === 'projection'
            ? theme.projection
            : series.styleRole === 'baseline'
              ? theme.baseline
              : theme.invested,
      },
      itemStyle: {
        color:
          series.styleRole === 'projection'
            ? theme.projection
            : series.styleRole === 'baseline'
              ? theme.baseline
              : theme.invested,
      },
      emphasis: {
        focus: 'series',
      },
    })),
  }
}
