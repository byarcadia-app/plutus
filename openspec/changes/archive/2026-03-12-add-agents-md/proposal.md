## Why

The project has no AI agent guidance files. Without AGENTS.md / CLAUDE.md, AI assistants lack context about project conventions, validation steps, changeset workflow, and the critical rule that `example/` is the source of truth for library consumption. This leads to inconsistent contributions and missed steps (forgotten changesets, unsynced example app, skipped validation).

## What Changes

- Add root `AGENTS.md` with project context, scripts, validation pipeline, changeset rules, example sync policy, hook conventions, docs requirements, and OpenSpec workflow
- Add root `CLAUDE.md` as a pointer (`@AGENTS.md`) for Claude Code compatibility
- Add `example/AGENTS.md` with example-specific context and the source-of-truth rule

## Capabilities

### New Capabilities

- `agents-md-setup`: Root AGENTS.md with project conventions, validation pipeline (including example typecheck), changeset workflow, example sync policy, and OpenSpec workflow reference

### Modified Capabilities

_None — this is additive documentation, no existing specs change._

## Impact

- New files: `AGENTS.md`, `CLAUDE.md`, `example/AGENTS.md`
- No code changes, no API changes, no dependency changes
- Affects all future AI-assisted development sessions
