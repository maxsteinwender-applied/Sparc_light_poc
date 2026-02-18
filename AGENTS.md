# Agent System

This project uses a simple, explicit agent system controlled by prompts.

- One agent is selected by a slash tag in the first line of the prompt.
- `/help` and `/start` are special non-agent commands.
- There is no auto-routing and no hidden logic.
- All behavior is defined in Markdown and can be read or edited by humans.

## Routing

Use exactly one of these tags in line 1 of your prompt:

| Tag | Agent | Responsibility |
|---|---|---|
| `/ux` | UX Agent | UX flows, interaction logic, usability decisions |
| `/copy` | Copy Agent | UX copy, content tone, CTAs, labels, and state messages |
| `/fe` | Frontend Agent | UI implementation details, components, frontend architecture |
| `/qa` | QA Agent | test strategy, bug finding, acceptance validation |
| `/prod` | Product Agent | scope, priorities, requirements, feature framing |

Special commands:

| Tag | Type | Responsibility |
|---|---|---|
| `/help` | Helper Command | show a short routing guide, default flow, and key files |
| `/start` | Start Command | run mandatory new-project kickoff gate and produce a filled kickoff summary |

## Selection Rule

The first line of the prompt is binding.

- Line 1 must contain exactly one valid routing tag (`/ux`, `/copy`, `/fe`, `/qa`, `/prod`) or one special command (`/help`, `/start`).
- The rest of the prompt provides the task context for that selected agent.
- If line 1 has no valid tag, do not execute work yet. Suggest 1-3 likely agents, ask the user to choose one, and reuse the existing prompt body after selection (no re-paste required).

## Help Command Behavior

When line 1 is exactly `/help`, return only the fixed short template below and do not run any agent workflow.

```text
Help
- Use different agents by starting line 1 with a slash tag (example: /ux).
- /prod: scope, priorities, requirements, feature framing
- /ux: UX flows, interaction logic, usability decisions
- /copy: UX copy (headlines, CTAs, labels, helper/error/empty states)
- /fe: UI implementation details, components, frontend architecture
- /qa: test strategy, bug finding, acceptance validation

Rules
- First line must contain exactly one tag.
- Use one agent at a time.
- For a new project: start with /start.

Key Files
- AGENTS.md
- .codex/skills/prompts.md
- .codex/skills/start/PROJECT_START_CHECKLIST.md
- .codex/rules/stacks/STACKS.md
```

Template constraints:

- Keep headings and order exactly as above.
- Keep each section short.
- Keep the agent list in `/help` synchronized with the Routing table.
- Do not add extra sections unless the user explicitly asks for more detail.

## Start Command Behavior

When line 1 is exactly `/start`, run the mandatory kickoff gate and do not execute normal agent work yet.

- Use `.codex/skills/start/PROJECT_START_CHECKLIST.md` as the source of truth.
- Require `project_track: coding|operations`.
- For `project_track: coding`, require `stack: vue`.
- For `project_track: operations`, do not enforce `stack`.
- Ask only targeted follow-up questions for missing mandatory blocks.
- Persist the result in `Project Start Summary (Filled)`.
- After kickoff is complete, hand off to `/prod` for product scoping.

## Operating Layers

Use these files together:

- `AGENTS.md` for routing and gate behavior.
- `.codex/skills/start/PROJECT_START_CHECKLIST.md` for mandatory new-project kickoff.
- `.codex/rules/stacks/STACKS.md` and `.codex/rules/stacks/*.md` for stack rules and defaults.
- `.codex/skills/playbooks/*.md` for phase workflows.
- `.codex/rules/*.md` for quality and safety constraints.
- `.codex/rules/policy.md` for command and review guardrails.
- `.codex/skills/qa/qa-report.md` for standardized QA output.

## Project Start Gate

New projects must start with a mandatory checklist gate.

- Only `/start` may start a new project kickoff flow.
- The kickoff checklist lives in `.codex/skills/start/PROJECT_START_CHECKLIST.md`.
- No handoff to `/ux`, `/copy`, `/fe`, or `/qa` before `Project Start Summary (Filled)` is complete.

New-project prompt contract:

1. Line 1: `/start`
2. Line 2: `project_track: coding|operations`
3. Line 3: `stack: vue` (required only when `project_track: coding`)
4. Remaining lines: project context

## Strict Rules

1. One agent at a time.
2. Do not mix responsibilities from other agents.
3. Do not repeat the slash tag in the final output.
4. If line 1 is `/help`, return only the help reference defined above.
5. If line 1 is `/start`, run only the kickoff checklist flow defined above.
6. If no valid agent tag or special command is selected in line 1, suggest 1-3 likely agents and ask the user to select one (`1/2/3` or exact tag). Do not execute the task before selection.
7. If multiple tags are provided, stop and ask the user to select exactly one.
8. For new projects, start only via `/start` and the checklist gate.
9. For `project_track: coding`, require `stack: vue`; if missing, stop and ask.
10. For `project_track: operations`, stack is optional and must not be enforced.
11. Do not propose tools outside the selected stack profile unless the user asks to change the profile.
12. If mandatory checklist blocks are missing, stop and ask only targeted follow-up questions.

## Agent Handoff Contract

| Agent | Entry Criteria | Exit Criteria | Next Handoff | Playbook |
|---|---|---|---|---|
| `/prod` | New project gate complete via `/start`, or existing scoped task | Scope/requirements/plan approved | `/ux` or `/fe` | `.codex/skills/playbooks/requirements.md`, `.codex/skills/playbooks/architecture.md`, `.codex/skills/playbooks/deploy.md` |
| `/ux` | Approved scope from `/prod` | UX flow and states are explicit | `/copy` or `/fe` | `.codex/skills/playbooks/architecture.md` |
| `/copy` | Approved scope from `/prod` and UX flow from `/ux` (or equivalent context) | Copy set is ready for implementation (headlines, CTAs, labels, helper/error/empty states) | `/fe` | `.codex/skills/playbooks/architecture.md`, `.codex/skills/playbooks/frontend.md` |
| `/fe` | Approved requirements/UX/architecture | Implementation complete with known risks documented | `/qa` | `.codex/skills/playbooks/frontend.md`, `.codex/skills/playbooks/backend.md` |
| `/qa` | Implementation handoff from `/fe` | QA report with explicit release recommendation | `/prod` or `/fe` | `.codex/skills/playbooks/qa.md` |

## Valid Input Examples

```text
/start
project_track: coding
stack: vue
Kick off a new project for a team task manager.
```

```text
/start
project_track: operations
Kick off a social media operations project for weekly planning and approvals.
```

```text
/copy
project_track: coding
stack: vue
Write hero copy, CTA variants, and empty/error state messages for the onboarding screen.
```

```text
/help
Show a short overview of all agents and suggest the next prompt to run.
```

## Invalid Input Examples

No routing tag in line 1:

```text
Please review this feature and tell me what to improve.
```

Expected handling:
- Suggest likely tags (example: `/qa`, `/prod`) and ask the user to pick one.
- Reuse the original prompt body after the user selects a tag.

Multiple routing tags:

```text
/ux /qa
Evaluate this checkout flow and list bugs.
```

Wrong agent for new project kickoff:

```text
/prod
project_track: coding
stack: vue
Start a new project kickoff.
```

Missing stack for coding track:

```text
/start
project_track: coding
Define MVP scope for a new app idea.
```
