# Project Start Checklist

## Purpose

Use this checklist as the mandatory gate for every new project.
The goal is to collect enough context before selecting stack, tools, and agent sequence.

## When This Is Mandatory

- Mandatory for every new project kickoff.
- Not mandatory for normal feature work inside an already-started project.

## Start Contract

- Only `/start` may run the project start checklist flow.
- Required field: `project_track: coding|operations`.
- `stack` is required only when `project_track: coding`.
- The final checklist result must be persisted in this same file under `Project Start Summary (Filled)`.

## Mandatory Question Blocks

1. Vision
2. Target Users
3. Domain/Track
4. Success Criteria
5. Constraints
6. Stack (coding only)
7. Initial Agent Sequence

## Stop Rules

1. If any mandatory block is missing, stop and ask targeted follow-up questions.
2. Do not recommend stack/tools until mandatory blocks are complete.
3. Do not hand off to `/ux`, `/copy`, `/fe`, or `/qa` before checklist summary is complete.
4. If `project_track: coding` and stack is missing, stop and ask for `stack: vue`.
5. If `project_track: operations`, stack must not be enforced.

## Empty Checklist Template

Copy and fill this section during kickoff Q&A.

```markdown
### Kickoff Record

- [ ] Vision defined
  - Answer:

- [ ] Target users defined
  - Answer:

- [ ] Project track selected (`coding` or `operations`)
  - Answer:

- [ ] Success criteria defined
  - Answer:

- [ ] Constraints defined
  - Answer:

- [ ] Stack selected (required only for coding)
  - Answer:

- [ ] Initial agent sequence defined
  - Answer:
```

## Project Start Summary (Filled)

Use this schema for the final, persisted kickoff result.

```markdown
### Project Start Summary

- Status: Incomplete | Complete
- Date: YYYY-MM-DD
- Owner: [name or team]

#### Vision
[final vision statement]

#### Target Users
[primary users and context]

#### Project Track
coding | operations

#### Success Criteria
- [criterion 1]
- [criterion 2]

#### Constraints
- [constraint 1]
- [constraint 2]

#### Stack
vue | n/a (operations)

#### Initial Agent Sequence
`/start` -> `/prod` -> [/ux] -> [/copy] -> [/fe] -> [/qa] (adjust as needed)

#### Open Questions
- [question]
```

## Decision Log

Document hard decisions and why they were made.

```markdown
### Decision
- Date: YYYY-MM-DD
- Topic:
- Decision:
- Reason:
- Impact:
```
