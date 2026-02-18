import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('starter smoke', () => {
  it('keeps the golden path contract in README', () => {
    const readme = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8')
    expect(readme).toContain('/start -> /prod -> /ux -> /copy -> /fe -> /qa -> /prod')
  })

  it('keeps PrimeVue chart baseline aligned with package dependencies', () => {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'))
    const stackDoc = readFileSync(resolve(process.cwd(), '.codex/rules/stacks/vue.md'), 'utf8')

    expect(stackDoc).toContain('PrimeVue')
    expect(stackDoc).toContain('chart.js')
    expect(Boolean(packageJson.dependencies?.primevue || packageJson.devDependencies?.primevue)).toBe(true)
    expect(Boolean(packageJson.dependencies?.['@primevue/nuxt-module'] || packageJson.devDependencies?.['@primevue/nuxt-module'])).toBe(true)
    expect(Boolean(packageJson.dependencies?.['chart.js'] || packageJson.devDependencies?.['chart.js'])).toBe(true)
  })
})
