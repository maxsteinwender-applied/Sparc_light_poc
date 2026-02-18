# QA Playbook

## Purpose

Validate implementation against acceptance criteria and release gates.

## Primary Agent

- `/qa`

## Entry Criteria

- Implementation notes from `/fe` are available.
- Acceptance criteria and edge cases are present in feature specs.

## Inputs

- Relevant `.codex/skills/product/features/PROJ-*.md`
- `.codex/skills/qa/qa-report.md`
- `.codex/rules/security.md`

## Input Checklist

- [ ] Acceptance criteria are explicit and testable.
- [ ] Edge cases are documented in feature spec.
- [ ] QA scope includes recent implementation changes.
- [ ] Security-sensitive paths are identified.
- [ ] Expected release gate conditions are known.

## Workflow

1. Build a pass/fail matrix from acceptance criteria.
2. Test happy paths, edge cases, and known risk paths.
3. Perform focused security checks for auth/data access and input handling.
4. Classify bugs by severity and business impact.
5. Produce a QA report using the template.
6. Give release recommendation: ready or not ready.

## Output Contract

- QA results are captured in `.codex/skills/qa/qa-report.md` format.
- Feature documentation includes pass/fail status per acceptance criterion.
- Bugs include severity, reproduction steps, expected vs actual behavior.
- Release recommendation is explicit with blocking reasons if not ready.

## Stop If Missing

Stop and ask targeted follow-up questions if any of the following is missing:
- Acceptance criteria are too vague to test reliably.
- Environment/setup required for QA is unavailable.
- Critical implementation context from `/fe` handoff is absent.
- Security-relevant behavior cannot be evaluated with current inputs.

## Exit Criteria

- QA report is complete and attached to feature documentation.
- Critical/high issues are clearly identified.
- Release recommendation is explicit.

## Handoff Target

- `/prod` for prioritization or `/fe` for fixes.
