# PROJ-1: Nuxt Migration and Vue-Only Stack Contract

**Status:** In Review
**Created:** 2026-02-17
**Last Updated:** 2026-02-17

## User Stories

- As a team using this starter, I want the coding stack to map to Nuxt so that our Vue prototype is aligned with our implementation runtime.
- As a maintainer, I want stack policy and docs to be Nuxt-only in this repo so that onboarding prompts are unambiguous.

## Acceptance Criteria

- [x] Runtime app shell uses Nuxt (`nuxt.config.ts`, `app.vue`, `pages/index.vue`).
- [x] `package.json` scripts for app runtime use Nuxt (`dev`, `build`, `start`).
- [x] Coding kickoff contract requires `stack: vue` for this repo.
- [x] Stack rules and active playbooks reference only the Vue/Nuxt stack profile.
- [x] Landing page and doc validator reference Nuxt file locations (`pages/index.vue`).
- [x] Supabase env var guidance uses `NUXT_PUBLIC_*` names.

## Edge Cases

- Missing `stack` on coding track kickoff should still block and ask targeted follow-up.
- Unsupported stack values should be rejected in favor of `stack: vue`.
- Missing Nuxt dependencies should fail early with clear command guidance (`npm install`).

## Architecture Notes

### Data Model
- No data-model changes in this feature.

### Component/Module Plan
- Replace Next.js app entrypoints with Nuxt app/page entrypoints.
- Keep agent workflow artifacts in `.codex` synchronized to Nuxt-only stack contract.
- Keep existing smoke test shape and adapt to Nuxt web server command.

---

## QA Test Results

**Tested:** 2026-02-17
**App URL:** http://localhost:3000

### Acceptance Criteria Status
- [x] AC-1: Nuxt runtime baseline builds and starts through project scripts.
- [x] AC-2: Coding stack contract is constrained to `stack: vue` in active workflow docs.
- [x] AC-3: Validation and test gates pass for docs, unit tests, and smoke e2e.

### Bugs Found
- None.
