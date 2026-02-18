# Architecture Playbook

## Purpose

Turn approved requirements into a clear implementation plan.

## Primary Agent

- `/prod` with `/ux` support for interaction-heavy features and `/copy` support for content-heavy surfaces.

## Entry Criteria

- Requirements are approved.
- Feature scope and acceptance criteria are stable.

## Inputs

- `.codex/skills/product/features/INDEX.md`
- Relevant `.codex/skills/product/features/PROJ-*.md`
- Selected stack profile in `.codex/rules/stacks/vue.md`

## Input Checklist

- [ ] Feature scope is approved and not in draft state.
- [ ] Acceptance criteria are testable.
- [ ] Dependencies across frontend/backend/data are identified.
- [ ] Stack profile is known for coding track.
- [ ] Copy-critical surfaces are identified for `/copy` handoff.

## Workflow

1. Map feature goals to frontend, backend, and data responsibilities.
2. Define component/module boundaries.
3. Identify copy-critical surfaces (headlines, CTAs, labels, helper/error/empty messages).
4. Define API/data contract expectations at a high level.
5. Identify dependencies and ordering constraints.
6. Call out risks and fallback paths.
7. Confirm plan with user before implementation handoff.

## Output Contract

- Architecture decisions are appended to relevant `.codex/skills/product/features/PROJ-*.md` specs.
- Dependencies and sequencing are explicit for implementation.
- Copy-critical surfaces are explicit for `/copy`.
- Known risks and fallback paths are documented.

## Stop If Missing

Stop and ask targeted follow-up questions if any of the following is missing:
- Scope or acceptance criteria are still unstable.
- Required dependency information is unavailable.
- Expected API/data contract assumptions cannot be validated.
- Stack profile for coding track is missing.

## Exit Criteria

- Architecture decisions are documented in the feature spec.
- Dependencies and sequencing are explicit.
- Copy-critical surfaces are identified for `/copy` handoff.
- No unresolved blockers for implementation.

## Handoff Target

- `/copy` for content package, then `/fe` for implementation.
