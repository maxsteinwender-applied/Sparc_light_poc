import type { SavingsProjectionPoint } from '../../domain/savingsPlan'
import type { ChartSeries } from '../types'

export const mapSavingsProjectionToSeries = (
  chartData: SavingsProjectionPoint[],
): ChartSeries[] => {
  return [
    {
      id: 'projection',
      label: 'Wert (Strategie)',
      styleRole: 'projection',
      points: chartData.map((point) => ({ x: point.year, y: point.value })),
    },
    {
      id: 'baseline',
      label: '0 % Vergleich',
      styleRole: 'baseline',
      points: chartData.map((point) => ({ x: point.year, y: point.zeroReturn })),
    },
    {
      id: 'invested',
      label: 'Eingezahlt',
      styleRole: 'invested',
      points: chartData.map((point) => ({ x: point.year, y: point.invested })),
    },
  ]
}
