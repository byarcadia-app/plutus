## Why

CI is failing because `example/package.json` references `@byarcadia-app/plutus` as `"0.1.0"` (published version) while `pnpm-lock.yaml` was generated with `workspace:*`. The `--frozen-lockfile` flag in CI detects this mismatch and aborts the install.

## What Changes

- Revert `example/package.json` dependency on `@byarcadia-app/plutus` from `"0.1.0"` back to `"workspace:*"`
- Regenerate `pnpm-lock.yaml` to match the updated specifier

## Capabilities

### New Capabilities

_None — this is a configuration fix, not a new capability._

### Modified Capabilities

_None — no spec-level behavior changes._

## Impact

- `example/package.json` — dependency specifier change
- `pnpm-lock.yaml` — regenerated lockfile
- CI pipeline — unblocked, `--frozen-lockfile` will pass again
