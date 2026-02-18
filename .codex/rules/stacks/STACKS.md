# Stack Profiles

This file defines how the project stack is selected for prompt-based work.

## Supported Stacks

- `vue` -> `.codex/rules/stacks/vue.md`

## Default Library Baselines

Use these as the default stack presets unless explicitly overridden.

### Vue (`stack: vue`)

- Framework: `Nuxt 3`
- UI: `PrimeVue` (OSS components)
- Styling: `Tailwind CSS` via `@nuxtjs/tailwindcss` (Tailwind v3 baseline)
- Charts: `PrimeVue Chart` (backed by `chart.js`)
- Backend/Auth: `Supabase`
- Deployment: `Vercel`
- Optional add-ons: `motion-v`, `@vueuse/core`, `@pinia/nuxt`, `vee-validate`, `zod`, `primeicons`

## Selection Contract

For a new project start, use this contract:

1. Line 1: `/start`
2. Line 2: track declaration (`project_track: coding|operations`)
3. Line 3: stack declaration (`stack: vue`) when track is `coding`
4. Remaining lines: task context

Example:

```text
/start
project_track: coding
stack: vue
Define MVP scope for a team task manager.
```

## Operating Rules

1. Stacks apply only to `project_track: coding`.
2. For `project_track: coding`, do not assume a stack if none is provided.
3. For `project_track: coding`, if stack is missing, ask a clarification question and stop.
4. For `project_track: operations`, stack is optional and must not be enforced.
5. If a stack is provided and unsupported, ask the user to choose `vue`.
6. Use only tools and conventions from the selected stack profile when in coding track.
7. If the user explicitly changes the stack later, confirm the change before continuing.

## Customization

Use the file below as the canonical source for your team defaults:

- `.codex/rules/stacks/vue.md`

You can update this profile at any time to set your preferred libraries.
