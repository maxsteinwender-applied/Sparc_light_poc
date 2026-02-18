import type { Options } from 'highcharts'
import type { ProjectionChartModel, ChartThemeTokens } from '../types'

export const buildHighchartsOptions = (
  model: ProjectionChartModel,
  theme: ChartThemeTokens,
): Options => {
  return {
    chart: {
      type: 'line',
      height: 360,
      backgroundColor: theme.background,
      spacing: [16, 16, 16, 16],
    },
    title: {
      text: model.title,
      style: {
        color: theme.text,
        fontSize: '16px',
        fontWeight: '600',
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: model.xAxisLabel,
        style: { color: theme.text },
      },
      labels: {
        style: { color: theme.text },
      },
      lineColor: theme.grid,
      tickColor: theme.grid,
      gridLineColor: theme.grid,
    },
    yAxis: {
      title: {
        text: model.yAxisLabel,
        style: { color: theme.text },
      },
      labels: {
        style: { color: theme.text },
      },
      gridLineColor: theme.grid,
    },
    legend: {
      itemStyle: {
        color: theme.text,
      },
    },
    tooltip: {
      shared: true,
      valueDecimals: 0,
      valueSuffix: ' EUR',
    },
    series: model.series.map((series) => ({
      type: 'line',
      name: series.label,
      data: series.points.map((point) => [point.x, point.y]),
      color:
        series.styleRole === 'projection'
          ? theme.projection
          : series.styleRole === 'baseline'
            ? theme.baseline
            : theme.invested,
      marker: {
        enabled: false,
      },
      lineWidth: series.styleRole === 'projection' ? 3 : 2,
      dashStyle:
        series.styleRole === 'baseline'
          ? 'ShortDash'
          : series.styleRole === 'invested'
            ? 'Dot'
            : 'Solid',
    })),
  }
}
