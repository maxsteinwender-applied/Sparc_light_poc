/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHART_PROVIDER?: 'echarts' | 'highcharts'
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
