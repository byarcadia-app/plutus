## ADDED Requirements

### Requirement: CI runs the test suite

The CI workflow SHALL run `pnpm test` after `pnpm check`, so a change that breaks pinned behaviour blocks the PR.

#### Scenario: Tests pass

- **WHEN** a PR is opened and every test passes
- **THEN** the `pnpm test` CI step passes

#### Scenario: Behaviour changes without its test

- **WHEN** a PR changes behaviour a test pins, without changing that test
- **THEN** the `pnpm test` CI step fails and blocks the PR
