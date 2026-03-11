## Why

The release workflow (`.github/workflows/release.yaml`) fails on every push to `main` because `@byarcadia-app/plutus` is not yet published to npm. Until the first manual publish, the changesets action cannot version or publish. Temporarily disabling the workflow avoids noisy CI failures.

## What Changes

- Disable the release workflow by renaming it to `.yaml.disabled` so GitHub Actions ignores it
- Can be re-enabled by removing the `.disabled` suffix once the package is published

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

- `.github/workflows/release.yaml` — temporarily disabled
- No effect on CI workflow (typecheck, lint, build)
