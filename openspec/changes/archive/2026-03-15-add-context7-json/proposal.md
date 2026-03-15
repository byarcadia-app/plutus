## Why

Context7 provides structured project metadata that AI tools and documentation systems can consume to understand a project's scope, conventions, and rules. Adding `context7.json` to plutus (mirroring the aether pattern) enables consistent AI-assisted development across all @byarcadia-app packages.

## What Changes

- Add a `context7.json` file at the project root with plutus-specific metadata
- Include project description, relevant folders, exclusions, and coding rules derived from CLAUDE.md and hook conventions
- Follow the same `$schema` and structure used in `@byarcadia-app/aether`

## Capabilities

### New Capabilities
- `context7-config`: Root-level `context7.json` file providing machine-readable project metadata — folders, exclusions, and development rules specific to plutus

### Modified Capabilities
<!-- None — this is a new standalone file with no impact on existing specs -->

## Impact

- New file: `context7.json` (project root)
- No code changes, no API changes, no dependency changes
- Docs-only addition — no changeset required
