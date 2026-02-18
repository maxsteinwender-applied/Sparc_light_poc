# Frontend Playbook

## Purpose

Implement UI behavior from approved requirements and architecture.

## Primary Agent

- `/fe`

## Entry Criteria

- Requirements and architecture are approved.
- Stack is selected and valid for coding track.
- Copy package from `/copy` is available for user-facing screens (or explicitly marked not required).

## Inputs

- Relevant `.codex/skills/product/features/PROJ-*.md`
- `.codex/rules/stacks/vue.md`
- `.codex/rules/frontend.md`
- `.codex/rules/policy.md`
- Copy inputs from `/copy` (headlines, CTAs, labels, state messages)

## Input Checklist

- [ ] Feature spec includes stable acceptance criteria.
- [ ] UX flow and states are explicit for affected screens.
- [ ] Copy package is approved for user-facing surfaces.
- [ ] Stack profile and frontend rules are confirmed.
- [ ] Known dependency constraints are documented.

## Workflow

1. Translate feature acceptance criteria into component tasks.
2. Reuse existing UI patterns before creating new abstractions.
3. Apply approved copy package to all user-facing text surfaces.
4. Implement default, loading, empty, error, and success states (with consistent copy behavior).
5. Apply accessibility and responsive requirements.
6. Validate against stack defaults (UI, motion, charts, backend client usage).
7. Summarize changes and known risks for QA handoff.

## Output Contract

- Frontend implementation is reflected in code for the scoped feature.
- Feature spec notes implementation decisions and known limitations.
- User-facing text matches approved copy package.
- QA handoff includes risk list and areas needing focused regression.

## Stop If Missing

Stop and ask targeted follow-up questions if any of the following is missing:
- Acceptance criteria are ambiguous or non-testable.
- Required UX states are undefined.
- Copy package is missing for user-facing changes.
- API/data assumptions are unclear and would force guesswork.

## Exit Criteria

- All frontend acceptance criteria are implemented.
- Copy is consistently integrated across screens and states.
- Responsive and accessibility checks are completed.
- Open issues are listed clearly.

## Handoff Target

- `/qa` for validation.
