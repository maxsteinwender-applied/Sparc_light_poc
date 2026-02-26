# Requirements Playbook

## Purpose

Define project scope and feature requirements before solution design.

## Primary Agent

- `/prod`

## Entry Criteria

- New project kickoff completed in `.codex/skills/start/PROJECT_START_CHECKLIST.md`.
- `Project Start Summary (Filled)` is marked complete.

## Inputs

- `.codex/skills/start/PROJECT_START_CHECKLIST.md`
- `.codex/skills/product/PRD.md`
- `.codex/skills/product/features/INDEX.md`
- `mvpscope.md`

## Input Checklist

- [ ] Kickoff summary is complete and current.
- [ ] Project track is explicit (`coding` or `operations`).
- [ ] Stack is explicit when track is `coding`.
- [ ] PRD baseline exists and reflects current vision.
- [ ] Feature index is readable and has next ID context.
- [ ] MVP scope baseline in `mvpscope.md` exists and reflects latest approved scope.

## Workflow

1. Confirm goals, users, and constraints from kickoff summary.
2. Compare Notion MVP scoping source against `mvpscope.md` and identify drift.
3. Define or refine MVP scope and explicit non-goals.
4. Update `mvpscope.md` sections and change log for every approved scope delta.
5. Convert scope into testable acceptance criteria.
6. Split work into feature-sized units.
7. Assign feature IDs and sequence in `.codex/skills/product/features/INDEX.md`.
8. Add or update feature specs in `.codex/skills/product/features/`.
9. Ask for user approval before handoff.

## Output Contract

- `.codex/skills/product/PRD.md` is aligned with current scope and priorities.
- `.codex/skills/product/features/INDEX.md` includes added/updated features and status.
- Relevant `.codex/skills/product/features/PROJ-*.md` specs contain testable AC and explicit scope boundaries.
- `mvpscope.md` reflects the latest approved MVP scope and includes a dated change log entry.
- Open decisions are listed explicitly for the next handoff.

## Stop If Missing

Stop and ask targeted follow-up questions if any of the following is missing:
- Kickoff summary is incomplete for a new project.
- User intent is ambiguous enough to change scope materially.
- Coding track is selected without `stack: vue`.
- Existing feature ID sequence is unclear.

## Exit Criteria

- PRD scope is aligned with kickoff summary.
- Feature specs exist for current scope.
- Acceptance criteria are testable.
- Build order is explicit.
- No unresolved MVP scope drift remains undocumented.

## Handoff Target

- `/ux` for UX flow and interaction design.
