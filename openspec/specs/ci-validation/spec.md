## ADDED Requirements

### Requirement: CI runs format check

The CI workflow SHALL run `pnpm fmt:check` as a step in the `check` job to catch formatting regressions on every PR and push to main.

#### Scenario: Formatting passes

- **WHEN** a PR is opened with correctly formatted code
- **THEN** the `pnpm fmt:check` CI step passes

#### Scenario: Formatting fails

- **WHEN** a PR is opened with incorrectly formatted code
- **THEN** the `pnpm fmt:check` CI step fails and blocks the PR

### Requirement: CI runs example app typecheck

The CI workflow SHALL run `pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit` after the build step to verify the example app typechecks against the built library.

#### Scenario: Example app types are valid

- **WHEN** a PR is opened and the library builds successfully
- **THEN** the example app typecheck CI step passes

#### Scenario: API change breaks example app

- **WHEN** a library API change is made without updating the example app
- **THEN** the example app typecheck CI step fails and blocks the PR

### Requirement: CI step order preserves dependencies

The example app typecheck step SHALL run after `pnpm build` because the example app imports from the built package output.

#### Scenario: Build precedes example typecheck

- **WHEN** the CI workflow executes
- **THEN** `pnpm build` completes before `pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit` runs

### Requirement: CI runs the test suite

The CI workflow SHALL run `pnpm test` after `pnpm check`, so a change that breaks pinned behaviour blocks the PR.

#### Scenario: Tests pass

- **WHEN** a PR is opened and every test passes
- **THEN** the `pnpm test` CI step passes

#### Scenario: Behaviour changes without its test

- **WHEN** a PR changes behaviour a test pins, without changing that test
- **THEN** the `pnpm test` CI step fails and blocks the PR
