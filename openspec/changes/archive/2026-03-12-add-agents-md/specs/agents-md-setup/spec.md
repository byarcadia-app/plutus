## ADDED Requirements

### Requirement: Root AGENTS.md with project context

The root `AGENTS.md` SHALL contain a one-liner project description, tech stack summary, scripts table, and package manager specification (pnpm).

#### Scenario: Agent reads project context

- **WHEN** an AI agent opens the repository
- **THEN** AGENTS.md provides enough context to understand the project without reading every file

### Requirement: Validation pipeline

The root `AGENTS.md` SHALL document a single validation command that runs typecheck, lint, format check, build, and example app typecheck in sequence.

#### Scenario: Agent runs validation after a code change

- **WHEN** an agent completes a code change
- **THEN** it runs `pnpm check && pnpm lint && pnpm fmt:check && pnpm build && pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit`

### Requirement: Changeset workflow

The root `AGENTS.md` SHALL document the changeset requirement: every code change (not docs-only) MUST include a changeset via `pnpm changeset` with the correct semver bump type.

#### Scenario: Agent adds a new hook

- **WHEN** an agent adds a new hook to `src/hooks/`
- **THEN** it creates a changeset with `minor` bump type

#### Scenario: Agent fixes a bug

- **WHEN** an agent fixes a bug
- **THEN** it creates a changeset with `patch` bump type

### Requirement: Example app sync policy

The root `AGENTS.md` SHALL state that `example/` is the source of truth for library consumption and MUST be updated after any API change in `src/`.

#### Scenario: Agent changes a hook's API

- **WHEN** an agent modifies a public hook signature in `src/`
- **THEN** it updates `example/` to reflect the new usage
- **AND** example typecheck passes

### Requirement: Hook conventions

The root `AGENTS.md` SHALL document core hook rules: callbacks for app-specific concerns, `onTrackEvent` fallback pattern, `PlutusError` in error callbacks, and the file naming convention for new hooks.

#### Scenario: Agent creates a new hook

- **WHEN** an agent adds a new hook
- **THEN** it follows the pattern: `src/hooks/use-{name}.ts`, consumes `usePlutus()`, exports from `src/index.ts`

### Requirement: OpenSpec workflow reference

The root `AGENTS.md` SHALL document the OpenSpec spec-driven development workflow with the 5 slash commands in order: explore, propose, apply, verify, archive.

#### Scenario: Agent starts a new feature

- **WHEN** an agent is asked to build a new feature
- **THEN** it can follow the OpenSpec workflow starting with `/openspec-explore` or `/openspec-propose`

### Requirement: CLAUDE.md pointer

A `CLAUDE.md` file SHALL exist at root containing only `@AGENTS.md` to redirect Claude Code to the main AGENTS.md.

#### Scenario: Claude Code loads project context

- **WHEN** Claude Code opens the repository and reads CLAUDE.md
- **THEN** it follows the `@AGENTS.md` pointer to load the full guide

### Requirement: Example-specific AGENTS.md

An `example/AGENTS.md` SHALL exist with example app tech stack (Expo, NativeWind, Expo Router) and the source-of-truth rule.

#### Scenario: Agent works on example app

- **WHEN** an agent modifies files in `example/`
- **THEN** `example/AGENTS.md` provides context about the Expo stack and the requirement to reflect all public API usage
