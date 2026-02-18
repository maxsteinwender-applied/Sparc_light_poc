# Codex Execution Policy

## Purpose

Define command and safety guardrails for this starter kit.

## Allowed by Default

- Read-only inspection commands (`ls`, `cat`, `rg`, `find`, `git status`, `git log`)
- Project checks (`npm run lint`, `npm run build`, test commands)
- Safe file edits inside repository scope

## Requires Explicit User Confirmation

- Dependency installs or upgrades
- Environment/configuration changes that affect deployment/runtime behavior
- Database schema/policy changes
- Production deploy actions
- Any command with destructive impact

## Disallowed Without Explicit Request

- History rewrite or destructive git actions (`git reset --hard`, force checkout on files)
- Bulk deletions
- Secret handling in plaintext files

## Review Gates

1. New project gate complete (`.codex/skills/start/PROJECT_START_CHECKLIST.md`).
2. Stack and track are explicit (`project_track`, conditional `stack`).
3. Rules reviewed for the active phase (`.codex/rules/*.md`).
4. QA recommendation is explicit before deploy.
