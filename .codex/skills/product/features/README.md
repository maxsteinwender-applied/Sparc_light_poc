# Feature Specifications

This folder stores feature specs used across the Codex agent workflow.

## Naming Convention

`PROJ-X-feature-name.md`

Examples:
- `PROJ-1-user-authentication.md`
- `PROJ-2-kanban-board.md`
- `PROJ-3-file-attachments.md`

## What A Feature Spec Must Include

### 1. User Stories
Describe the user goal:

```markdown
As a [user type], I want to [action] so that [outcome].
```

### 2. Acceptance Criteria
Use concrete, testable outcomes:

```markdown
- [ ] User can enter email and password
- [ ] Password must be at least 8 characters
- [ ] User is signed in after successful registration
```

### 3. Edge Cases
Document expected behavior for failures and corner cases:

```markdown
- Duplicate email registration
- Network failure while submitting form
- Concurrent edits from multiple users
```

### 4. Architecture Notes
Add the agreed implementation direction after requirements are approved:

```markdown
## Data Model
[schema notes]

## Component/Module Plan
[UI and service boundaries]
```

### 5. QA Results
At the end of implementation, QA appends test results to the same feature spec:

```markdown
---

## QA Test Results

**Tested:** 2026-01-12
**App URL:** http://localhost:3000

### Acceptance Criteria Status
- [x] AC-1: User can enter email and password
- [x] AC-2: Password length is validated
- [ ] BUG: Duplicate email is not rejected

### Bugs Found
**BUG-1: Duplicate email registration**
- **Severity:** High
- **Steps to Reproduce:** 1) Register with an email, 2) Try again with same email
- **Expected:** Error message
- **Actual:** Request appears to succeed
```

### 6. Deployment Status
After release, append deployment details:

```markdown
---

## Deployment

**Status:** Deployed
**Deployed:** 2026-01-13
**Production URL:** https://your-app.vercel.app
**Git Tag:** v1.0.0-PROJ-1
```

## Workflow And Agent Ownership

1. `/prod` defines or refines scope and acceptance criteria.
2. `/ux` defines user flow and UX states.
3. `/copy` provides implementation-ready UX copy (headlines, CTAs, states).
4. `/fe` implements frontend/backend changes according to the approved spec.
5. `/qa` validates behavior and appends QA results.
6. `/prod` decides release readiness and priorities for follow-up.

## Status Tracking

Track feature status in each feature document:

```markdown
# PROJ-1: Feature Name

**Status:** Planned | In Progress | In Review | Deployed
**Created:** 2026-01-12
**Last Updated:** 2026-01-12
```

Use Git history as the source of truth for implementation details.
