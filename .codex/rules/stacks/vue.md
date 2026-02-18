# Vue Stack Profile

## Purpose

Use this profile when the selected stack is `vue`.

## Framework

- Primary: Nuxt 3 + TypeScript
- Runtime target: modern web applications with SSR-first Vue workflow

## UI and Styling

- Default stack libraries (must be installed):
  - `nuxt`
  - `@primevue/nuxt-module`
  - `primevue`
  - `@nuxtjs/tailwindcss`
  - `tailwindcss` + `postcss` + `autoprefixer`
  - `chart.js` (required by PrimeVue Chart)

- Optional add-ons (install when feature scope needs them):
  - `@vueuse/core`
  - `@pinia/nuxt`
  - `vee-validate`
  - `zod`
  - `motion-v`
  - `primeicons`

## Motion and Animations

- Optional add-on: `motion-v`

## Charts and Data Visualization

- PrimeVue `Chart` (backed by `chart.js`)

## Forms and Validation

- Optional add-ons: `vee-validate`, `zod`

## State and Data

- Global state: Pinia (`@pinia/nuxt`, optional add-on)
- Server data: Nuxt data-fetching patterns (`useFetch`, server routes)
- Backend and auth: Supabase (default)

## Deployment

- Vercel (default)

## Quality and Tooling

- Linting: ESLint (Vue + TypeScript rules)
- Build: Nuxt build pipeline
- Package manager: npm (default in this starter)

## Testing (Current Baseline)

- Unit/component: Vitest + Vue Test Utils.
- E2E smoke: Playwright (`@playwright/test`, Chromium project).

## Agent Notes

- `/fe` should use Vue/Nuxt component and composable patterns from this profile.
- `/qa` should build test plans for Vue/Nuxt behaviors.
- `/prod` and `/ux` should avoid suggesting React-specific patterns when this stack is selected.
