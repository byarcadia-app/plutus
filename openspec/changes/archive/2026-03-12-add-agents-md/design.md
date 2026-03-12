## Context

Plutus has no AGENTS.md or CLAUDE.md. The sibling project `@byarcadia-app/aether` has a comprehensive AGENTS.md (286 lines) covering its full component system. Plutus is simpler (~8 source files, 3 hooks) and needs a leaner guide following the "ruthlessly minimal" approach from the aihero.dev AGENTS.md guide.

The key conventions to capture are:
- Validation pipeline (typecheck, lint, fmt, build + example typecheck)
- Changeset workflow (every code change needs one)
- Example app as source of truth (API changes must be reflected)
- OpenSpec spec-driven development workflow

## Goals / Non-Goals

**Goals:**
- Provide AI agents with enough context to work correctly on the project
- Enforce validation, changeset, and example sync habits
- Keep it minimal — progressive disclosure via CONTRIBUTING.md and example/AGENTS.md

**Non-Goals:**
- Documenting full directory structure (only 8 source files, discoverable)
- Duplicating CONTRIBUTING.md content (link to it instead)
- Setting up docs/ infrastructure (future work)

## Decisions

**1. AGENTS.md + CLAUDE.md pointer pattern**
Root `AGENTS.md` holds all content. `CLAUDE.md` contains only `@AGENTS.md`. This keeps one source of truth while supporting both the open standard and Claude Code's convention.

**2. Minimal root (~60 lines) with progressive disclosure**
Following aihero.dev guide: 1-liner description, package manager, scripts table, then only project-specific rules. Detailed conventions already live in CONTRIBUTING.md — no need to duplicate. Example-specific context lives in `example/AGENTS.md`.

**3. Validation includes example typecheck**
The validation command includes `pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit`. This enforces the "example is source of truth" rule — if you break the example, validation fails.

**4. OpenSpec workflow section with slash commands**
Lists the 5 OpenSpec commands in order (`explore → propose → apply → verify → archive`). Gives agents the full development workflow without needing to discover it.

## Risks / Trade-offs

- [Validation command is long] → Single copy-paste line; agents will use it as-is
- [example typecheck may be slow] → Acceptable trade-off for catching sync issues early
- [AGENTS.md may drift from CONTRIBUTING.md] → Minimal overlap by design; AGENTS.md links to CONTRIBUTING.md for details
