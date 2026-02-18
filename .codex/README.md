# Codex Workspace Map

This folder contains the active Codex workflow configuration for this starter kit.

## Active Structure

- `agents/`
  - Agent-specific role definitions used by slash-tag routing.
- `rules/`
  - Quality, safety, and stack constraints.
  - Stack profiles live in `rules/stacks/`.
- `skills/`
  - Operational workflow content (kickoff checklist, product docs, playbooks, prompt cheat sheet, QA template, references).
- `legacy/`
  - Read-only reference artifacts from the previous Claude-oriented setup.

## Where To Start

1. `AGENTS.md` for routing and command behavior.
2. `.codex/skills/start/PROJECT_START_CHECKLIST.md` for mandatory new-project kickoff.
3. `.codex/skills/prompts.md` for prompt templates and standard flow.
4. `.codex/rules/stacks/STACKS.md` for coding stack selection rules.

## Notes

- Keep active changes inside `agents/`, `rules/`, and `skills/`.
- Do not treat `legacy/` as active workflow configuration.
