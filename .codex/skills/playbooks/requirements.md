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

## Input Checklist

- [ ] Kickoff summary is complete and current.
- [ ] Project track is explicit (`coding` or `operations`).
- [ ] Stack is explicit when track is `coding`.
- [ ] PRD baseline exists and reflects current vision.
- [ ] Feature index is readable and has next ID context.

## Workflow

1. Confirm goals, users, and constraints from kickoff summary.
2. Define or refine MVP scope and explicit non-goals.
3. Convert scope into testable acceptance criteria.
4. Split work into feature-sized units.
5. Assign feature IDs and sequence in `.codex/skills/product/features/INDEX.md`.
6. Add or update feature specs in `.codex/skills/product/features/`.
7. Ask for user approval before handoff.

## Output Contract

- `.codex/skills/product/PRD.md` is aligned with current scope and priorities.
- `.codex/skills/product/features/INDEX.md` includes added/updated features and status.
- Relevant `.codex/skills/product/features/PROJ-*.md` specs contain testable AC and explicit scope boundaries.
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

## Handoff Target

- `/ux` for UX flow and interaction design.
