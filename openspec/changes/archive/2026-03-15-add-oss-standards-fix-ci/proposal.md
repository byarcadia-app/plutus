## Why

Plutus is missing standard open-source community files (CODE_OF_CONDUCT.md, SECURITY.md) that contributors and security researchers expect. Additionally, the CI pipeline only runs `check`, `lint`, and `build` — but CLAUDE.md and the PR checklist also require `fmt:check` and example app typechecking. This gap means formatting regressions and example breakage can slip through CI undetected.

## What Changes

- Add `CODE_OF_CONDUCT.md` using Contributor Covenant v2.1
- Add `SECURITY.md` with vulnerability disclosure policy
- Add `pnpm fmt:check` step to CI workflow
- Add `pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit` step to CI workflow

## Capabilities

### New Capabilities

- `oss-standards`: Community standard files (Code of Conduct, Security Policy)
- `ci-validation`: Full CI validation alignment with CLAUDE.md requirements

### Modified Capabilities

_None — no existing spec-level requirements are changing._

## Impact

- **Files created**: `CODE_OF_CONDUCT.md`, `SECURITY.md`
- **Files modified**: `.github/workflows/ci.yaml`
- **CI**: Two additional steps in the `check` job; pipeline will now catch formatting and example app type errors
- **No code changes**: Library source and example app are untouched
