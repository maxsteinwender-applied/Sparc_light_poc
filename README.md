# Codex Agent Starter Kit (Nuxt)

Build production-ready products faster with an explicit, file-based Codex workflow.

This starter kit is optimized for fast team onboarding:
- clear agent routing in `AGENTS.md`
- mandatory new-project kickoff gate via `/start`
- structured handoffs across Product, UX, Copy, Frontend, and QA
- documented quality and release checks

## What Problem This Solves

Teams usually lose time in AI workflows because context is implicit and handoffs are fuzzy.
This kit makes the workflow explicit, auditable, and repeatable:
- one agent at a time
- one source of truth per phase
- consistent artifacts on disk instead of chat memory

## Prerequisites

- Node.js `20+`
- npm `10+`

## UI Baseline

This starter kit uses **PrimeVue (OSS)** as the default component library.

Default stack libraries (installed in this starter):
- `nuxt`
- `@primevue/nuxt-module` + `primevue`
- `@nuxtjs/tailwindcss` + `tailwindcss` + `postcss` + `autoprefixer`
- `chart.js` (for PrimeVue `Chart`)

Core app kit baseline for new features:
- Buttons and actions: `Button`
- Forms: `InputText`, `Select`, `Textarea`, `Checkbox`, `ToggleSwitch`, `Form`
- Feedback and overlays: `Message`, `Dialog`, `Toast`
- Structure and navigation: `Card`, `Tabs`, `Menu`
- Data display: `DataTable`, `Paginator`, `Skeleton`, `Chart` (backed by `chart.js`)

Optional add-ons (install on demand):
- `@vueuse/core`, `@pinia/nuxt`, `vee-validate`, `zod`, `motion-v`, `primeicons`

## Quick Start (5 Steps)

1. Install dependencies:

```bash
npm install
```

2. (Optional) Create local env overrides when your feature needs backend credentials:

```bash
cp .env.example .env.local
```

3. Run baseline environment checks:

```bash
npm run doctor
```

4. Start the app:

```bash
npm run dev
```

5. Start a new project with the mandatory kickoff gate:

For coding track:

```text
/start
project_track: coding
stack: vue
Kick off a new project for a team task manager.
Run the full project start checklist and ask only missing mandatory questions.
```

For operations track:

```text
/start
project_track: operations
Kick off a social media operations project for weekly planning and approvals.
Run the full project start checklist and ask only missing mandatory questions.
```

For new projects, always start with `/start`.

## Environment Variables

Base template:
- `.env.example` is the canonical template to copy from.
- `.env.local.example` is provided for local-only override workflows.

Current keys:
- `NUXT_PUBLIC_EMAILJS_SERVICE_ID` (required for "Ergebnis per E-Mail senden")
- `NUXT_PUBLIC_EMAILJS_TEMPLATE_ID` (required for "Ergebnis per E-Mail senden")
- `NUXT_PUBLIC_EMAILJS_PUBLIC_KEY` (required for "Ergebnis per E-Mail senden")
- `NUXT_PUBLIC_EMAIL_FROM_NAME` (optional sender name, default: `Sparc Light POC`)
- `NUXT_PUBLIC_CHART_PROVIDER` (`echarts` by default)
- `NUXT_PUBLIC_ENABLE_HIGHCHARTS` (`false` by default, enable only when needed)

Recommended flow:
1. Copy `.env.example` to `.env.local`.
2. Fill only keys required by your current feature.
3. Keep secrets in `.env.local` (never commit).

## End-to-End Workflow (Golden Path)

`/start -> /prod -> /ux -> /copy -> /fe -> /qa -> /prod`

1. Kickoff (`/start`)
- Collect mandatory project context from `.codex/skills/start/PROJECT_START_CHECKLIST.md`.
- Produce `Project Start Summary (Filled)` before normal agent work.

2. Scope (`/prod`)
- Define scope, priorities, acceptance criteria, and sequencing.
- Update PRD and feature specs.

3. UX (`/ux`)
- Define flows, interaction logic, and state behavior.

4. Copy (`/copy`)
- Produce implementation-ready headlines, CTAs, labels, helper/error/empty states.

5. Build (`/fe`)
- Implement frontend plan from approved scope, UX, and copy.

6. QA (`/qa`)
- Validate against acceptance criteria and security checks.
- Produce release recommendation.

7. Release Gate (`/prod`)
- Decide release readiness and prioritize follow-up work.

## What Gets Created Where

- Product vision and roadmap: `.codex/skills/product/PRD.md`
- Feature tracking and IDs: `.codex/skills/product/features/INDEX.md`
- Feature specifications: `.codex/skills/product/features/PROJ-*.md`
- QA report format: `.codex/skills/qa/qa-report.md`

## Available Commands And Responsibilities

| Command | Role | Primary Outcome |
|---|---|---|
| `/start` | Kickoff command | Complete new-project gate and filled kickoff summary |
| `/prod` | Product agent | Scope, requirements, acceptance criteria, priorities |
| `/ux` | UX agent | UX flow, interaction logic, state behavior |
| `/copy` | Copy agent | Implementation-ready copy package for all states |
| `/fe` | Frontend agent | Component and UI implementation decisions |
| `/qa` | QA agent | Test strategy, findings, release recommendation |
| `/help` | Helper command | Short routing guide and next-step direction |

## Quality Gates

| Gate | Command | Expected Result |
|---|---|---|
| Environment | `npm run doctor` | Required files and runtime prerequisites are present |
| Docs contract | `npm run validate:docs` | Routing, command tags, paths, and start-flow guidance are consistent |
| Code quality | `npm run lint` | ESLint passes |
| Type safety | `npm run typecheck` | Nuxt type checking passes |
| Build | `npm run build` | Production build succeeds |
| Unit tests | `npm run test:unit` | Vitest suite passes |
| E2E smoke | `npm run test:e2e` | Playwright smoke suite passes |
| Combined check | `npm run check` | Lint + typecheck + build pass together |

## Common Pitfalls

1. Missing routing tag in prompt line 1.
Fix: the assistant should suggest likely agents and let you choose one without retyping the full prompt.

2. Starting new projects with `/prod`.
Fix: kickoff must begin with `/start`.

3. Missing `stack` on coding track kickoff.
Fix: include `stack: vue` when `project_track: coding`.

4. Skipping UX/copy handoff before frontend implementation.
Fix: complete `/ux` and `/copy` outputs before `/fe` for user-facing features.

5. Inconsistent docs after workflow edits.
Fix: run `npm run validate:docs` after changing `README.md`, `AGENTS.md`, `.codex/skills/prompts.md`, or onboarding UI text.

## Repo Map (Active Codex Files)

- Routing and strict rules: `AGENTS.md`
- Prompt reference and templates: `.codex/skills/prompts.md`
- New-project checklist gate: `.codex/skills/start/PROJECT_START_CHECKLIST.md`
- Stack profiles: `.codex/rules/stacks/STACKS.md`, `.codex/rules/stacks/vue.md`
- Playbooks by phase: `.codex/skills/playbooks/*.md`
- Quality and safety rules: `.codex/rules/*.md`, `.codex/rules/policy.md`
- Product and features: `.codex/skills/product/PRD.md`, `.codex/skills/product/features/INDEX.md`, `.codex/skills/product/features/README.md`
- QA output contract: `.codex/skills/qa/qa-report.md`

## How To Extend

1. Add product requirements in `.codex/skills/product/PRD.md` and feature specs in `.codex/skills/product/features/PROJ-*.md`.
2. Add reusable compositions in `components/` and route-level screens in `pages/` using PrimeVue components.
3. Add new checks as npm scripts and wire them into `check:ci` so CI stays deterministic.

## Scripts

```bash
npm run dev
npm run doctor
npm run validate:docs
npm run lint
npm run format
npm run typecheck
npm run build
npm run check
npm run test:unit
npm run test:e2e:install
npm run test:e2e
npm run check:ci
```

## Troubleshooting

### `nuxt: command not found`

Cause:
- Dependencies are not installed, or `node_modules` is missing.

Fix:
1. Run `npm install`
2. Run `npm run doctor`
3. Retry `npm run dev` or `npm run check`

### Missing EmailJS environment variables

If your feature needs email sending:
1. Copy `.env.example` to `.env.local`
2. Fill `NUXT_PUBLIC_EMAILJS_SERVICE_ID`, `NUXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NUXT_PUBLIC_EMAILJS_PUBLIC_KEY`

`npm run doctor` treats `.env.local` as optional until backend/auth features require it.
