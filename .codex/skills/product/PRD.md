# Product Requirements Document

## Vision
Provide a Nuxt-based Codex starter kit that keeps agent routing, kickoff discipline, and quality gates explicit and reproducible.

## Target Users
- Product and engineering teams using Codex with explicit agent handoffs.
- Developers who need a Vue/Nuxt-first template with documented process guardrails.

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | Nuxt runtime starter baseline | In Review |
| P0 (MVP) | Nuxt-only stack policy (`stack: vue`) | In Review |
| P1 | PrimeVue component baseline | Planned |
| P2 | Advanced CI quality matrix | Planned |

## Success Metrics
- New-project kickoff works with `stack: vue` and passes docs contract checks.
- Local Nuxt app starts and renders onboarding landing page.
- Quality gates (`doctor`, `validate:docs`, lint/build/test) are runnable from starter scripts.

## Constraints
- Keep the existing Codex agent workflow and file contracts intact.
- Migrate in-place in this repository to Nuxt.
- Preserve Vercel as deployment default.

## Non-Goals
- Maintaining React stack support in this repository.
- Building a second React starter kit inside this repo.

---

Use `/prod` to turn roadmap items into scoped, testable feature specs in
`.codex/skills/product/features/INDEX.md` and `.codex/skills/product/features/`.
