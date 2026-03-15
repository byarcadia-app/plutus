## ADDED Requirements

### Requirement: Example app uses workspace protocol for local dependency

The `example/package.json` SHALL reference `@byarcadia-app/plutus` using `"workspace:*"` so that pnpm resolves it via workspace protocol consistently.

#### Scenario: CI install with frozen lockfile succeeds

- **WHEN** CI runs `pnpm install --frozen-lockfile`
- **THEN** install completes without specifier mismatch errors
