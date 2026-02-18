# Backend Playbook

## Purpose

Implement backend/API and data-layer requirements (Supabase-first).

## Primary Agent

- `/fe` (until a dedicated backend agent is introduced).

## Entry Criteria

- Backend scope is explicitly defined in the feature spec.
- Data and authorization expectations are approved.

## Inputs

- Relevant `.codex/skills/product/features/PROJ-*.md`
- `.codex/rules/backend.md`
- `.codex/rules/security.md`
- `.codex/rules/policy.md`

## Workflow

1. Define data model changes and access rules.
2. Implement API routes or server handlers required by acceptance criteria.
3. Apply input validation and auth checks on write/read boundaries.
4. Enforce Supabase RLS and document policy assumptions.
5. Integrate frontend consumers and error handling.
6. Prepare handoff notes for QA with risky paths highlighted.

## Exit Criteria

- Backend acceptance criteria are implemented.
- Security and auth checks are in place.
- RLS and validation expectations are documented.

## Handoff Target

- `/qa` for validation.
