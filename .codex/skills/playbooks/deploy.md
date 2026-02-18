# Deploy Playbook

## Purpose

Release approved features safely to production.

## Primary Agent

- `/prod` (release decision) with `/fe` support (technical execution).

## Entry Criteria

- QA status is ready.
- No unresolved critical/high defects.
- Required environment variables are defined.

## Inputs

- QA report from `.codex/skills/qa/qa-report.md`
- `.codex/rules/security.md`
- Stack deployment defaults in `.codex/rules/stacks/vue.md`

## Workflow

1. Confirm release scope and version boundary.
2. Run pre-deploy checks (build, lint, config).
3. Validate environment and secret setup.
4. Execute deployment to Vercel.
5. Run post-deploy smoke checks on critical paths.
6. Document release status and rollback path.

## Exit Criteria

- Deployment is successful and verified.
- Release notes and known issues are documented.
- Rollback path is confirmed.

## Handoff Target

- `/prod` for closure and next-priority planning.
