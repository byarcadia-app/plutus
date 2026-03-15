## Context

The `@byarcadia-app/aether` package already ships a `context7.json` at project root, providing structured metadata for AI tools. Plutus currently lacks this file, making AI-assisted development inconsistent across the monorepo.

The context7 schema (`https://context7.com/schema/context7.json`) defines a standard format with: `projectTitle`, `description`, `folders`, `excludeFolders`, `excludeFiles`, and `rules`.

## Goals / Non-Goals

**Goals:**

- Add `context7.json` to plutus root following the same structure as aether
- Populate with plutus-specific folders, exclusions, and development rules derived from CLAUDE.md
- Maintain consistency with the aether pattern for cross-package tooling

**Non-Goals:**

- Modifying any source code or build configuration
- Adding context7 validation to CI
- Auto-generating context7.json from CLAUDE.md (manual curation is preferred)

## Decisions

1. **File location: project root** — matches aether pattern and context7 convention. Alternatives (e.g., `.context7/config.json`) are non-standard.

2. **Folders to include: `src`, `docs`** — these are the primary development surfaces. `example/` is excluded because it has its own AGENTS.md and serves as a consumer, not part of the library itself.

3. **Rules derived from CLAUDE.md hook conventions** — rules focus on callback patterns, error handling, and hook structure that are unique to plutus. Generic TypeScript/tooling rules are omitted since they're standard.

## Risks / Trade-offs

- **[Staleness]** → Rules in context7.json may drift from CLAUDE.md over time. Mitigation: mention in CLAUDE.md docs section that context7.json should stay in sync.
- **[Over-specification]** → Too many rules reduce signal-to-noise. Mitigation: keep rules focused on plutus-specific conventions only.
