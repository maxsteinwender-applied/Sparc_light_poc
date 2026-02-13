import type { ChartThemeTokens } from './types'

const FALLBACK_THEME: ChartThemeTokens = {
  background: '#FFFFFF',
  text: '#003745',
  grid: '#E6EEF0',
  projection: '#003745',
  baseline: '#9FB6BC',
  invested: '#568996',
}

const readCssVariable = (
  styles: CSSStyleDeclaration,
  variableName: string,
  fallback: string,
): string => {
  const value = styles.getPropertyValue(variableName).trim()
  return value.length > 0 ? value : fallback
}

export const resolveChartThemeTokens = (): ChartThemeTokens => {
  if (typeof window === 'undefined') {
    return FALLBACK_THEME
  }

  const styles = window.getComputedStyle(document.documentElement)

  return {
    background: readCssVariable(styles, '--background', FALLBACK_THEME.background),
    text: readCssVariable(styles, '--foreground', FALLBACK_THEME.text),
    grid: readCssVariable(styles, '--deka-divider', FALLBACK_THEME.grid),
    projection: readCssVariable(styles, '--chart-1', FALLBACK_THEME.projection),
    baseline: readCssVariable(styles, '--chart-3', FALLBACK_THEME.baseline),
    invested: readCssVariable(styles, '--chart-2', FALLBACK_THEME.invested),
  }
}
