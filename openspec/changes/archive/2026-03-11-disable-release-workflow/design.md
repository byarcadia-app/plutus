## Context

The release workflow runs on every push to `main` and attempts to use changesets to version/publish. Since the package isn't on npm yet, this always fails.

## Goals / Non-Goals

**Goals:**

- Stop the release workflow from running until the package is ready to publish

**Non-Goals:**

- Fixing the release workflow itself
- Publishing the package

## Decisions

Rename `.github/workflows/release.yaml` → `.github/workflows/release.yaml.disabled`. GitHub Actions only picks up `.yml`/`.yaml` files, so appending `.disabled` effectively turns it off while keeping the file in the repo for easy re-enablement.

Alternative considered: adding `if: false` to the job — works but still shows as a skipped workflow in the Actions tab.

## Risks / Trade-offs

- Someone might forget to re-enable it → mitigated by clear naming convention and a comment in the file
