# UI Core Usage Guide

Use this guide to keep feature implementation simple while preserving access to the full UI library.

## Core-First Component Set

Start new features with these components unless requirements demand more:
- `button`
- `input`
- `textarea`
- `label`
- `card`
- `dialog`
- `toast` / `toaster`
- `badge`

These cover most CRUD, form, and confirmation flows with low complexity.

## When Core Is Enough

Choose core-only when:
- The feature is form-heavy or list/detail oriented.
- Interactions are linear and do not require nested overlays.
- You can express status and feedback with text, badges, and toast messages.

## When To Use Advanced Primitives

Use additional components from `src/components/ui` when the feature clearly needs them, for example:
- `tabs` for dense multi-view workflows.
- `sheet` for side-panel editing without route changes.
- `command` for keyboard-driven search/command palettes.
- `navigation-menu` for complex top-level information architecture.

Prefer one advanced primitive at a time and justify it in the feature spec.

## Core-First Example

Feature: invite team members

1. Build the invite form with `card`, `label`, `input`, and `button`.
2. Show feedback with `toast`.
3. Add confirmation in `dialog` only if destructive actions are involved.
4. Introduce `tabs` later only if user testing shows real navigation friction.
