# Prompt Cheat Sheet

Use this as the fast reference for the Codex agent workflow.

## Quick Rule

- Line 1 must contain exactly one tag: `/start`, `/prod`, `/ux`, `/copy`, `/fe`, `/qa`, or `/help`.
- If line 1 is missing a valid tag, suggest 1-3 likely agents and ask the user to choose (`1/2/3` or tag). Reuse the existing prompt body after selection.
- Use one agent at a time.
- New projects must start with `/start`.
- For `project_track: coding`, `stack: vue` is required.
- For `project_track: operations`, stack is optional and must not be enforced.

Standard flow:

`/start -> /prod -> /ux -> /copy -> /fe -> /qa -> /prod`

## First 30 Minutes

### 0-5 min: Verify environment

```bash
npm install
npm run doctor
npm run dev
```

### 5-10 min: Kickoff (coding)

```text
/start
project_track: coding
stack: vue
Kick off a new project for a team task manager.
Run the full project start checklist and ask only missing mandatory questions.
```

### 5-10 min: Kickoff (operations)

```text
/start
project_track: operations
Kick off a social media operations project for weekly planning and approvals.
Run the full project start checklist and ask only missing mandatory questions.
```

### 10-20 min: Scope and acceptance criteria

```text
/prod
project_track: coding
stack: vue
Use the completed kickoff summary.
Define MVP scope, non-goals, and testable acceptance criteria for the first feature.
```

### 20-30 min: UX and copy handoff prep

```text
/ux
project_track: coding
stack: vue
Based on approved scope, define user flow and states (default, loading, empty, error, success).
```

```text
/copy
project_track: coding
stack: vue
Based on approved scope and UX flow, write implementation-ready headlines, CTAs, labels, helper/error/empty states.
```

## Track Branches

### Coding Track

Use this sequence:
1. `/start`
2. `/prod`
3. `/ux`
4. `/copy`
5. `/fe`
6. `/qa`
7. `/prod`

### Operations Track

Use this sequence:
1. `/start`
2. `/prod`
3. `/ux` (if user flow design is needed)
4. `/copy` (if messaging artifacts are needed)
5. `/qa` (process validation)
6. `/prod`

## Mini Handoff Prompts (No Role Mixing)

### Product -> UX

```text
/ux
project_track: coding
stack: vue
Use the approved scope and acceptance criteria for PROJ-1.
Define complete UX flow and all required UI states.
Do not change product scope.
```

### UX -> Copy

```text
/copy
project_track: coding
stack: vue
Use the approved UX flow for PROJ-1.
Write final UX copy for headlines, CTAs, labels, helper text, and error/empty states.
Do not alter flow logic.
```

### Copy -> Frontend

```text
/fe
project_track: coding
stack: vue
Implement PROJ-1 from approved requirements, UX flow, and copy package.
Use PrimeVue components as the default component baseline.
Document assumptions and known risks for QA handoff.
```

### Frontend -> QA

```text
/qa
project_track: coding
stack: vue
Validate PROJ-1 against acceptance criteria and edge cases.
Return a QA report and explicit release recommendation.
```

## Help Command

```text
/help
Show a short overview of all agents, default flow, and key files.
```

## Troubleshooting

### Invalid first line (no tag)

Issue:
- Prompt starts without a routing tag.

Fix:
- Suggest likely agents and ask the user to choose one.
- After selection, reuse the original prompt body and continue.

Example:

```text
I need help defining MVP scope for a team invite flow.
```

### Multiple tags in line 1

Issue:
- Prompt line 1 contains more than one tag.

Fix:
- Keep exactly one tag in line 1.

### New project started with `/prod`

Issue:
- Kickoff gate is skipped.

Fix:
- Start with `/start`, finish the checklist summary, then continue with `/prod`.

### Coding track without stack

Issue:
- `project_track: coding` provided but stack is missing.

Fix:
- Add `stack: vue` in line 3.

## Validation Reminder

After editing workflow docs, run:

```bash
npm run validate:docs
```
