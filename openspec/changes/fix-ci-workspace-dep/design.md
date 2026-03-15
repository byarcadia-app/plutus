## Context

The monorepo uses pnpm workspaces with two packages: the root library (`@byarcadia-app/plutus`) and `example/`. Commit `128f2d7` changed the example dependency from `workspace:*` to `0.1.0` to point at the published package. However, since `example/` is still declared as a workspace member in `pnpm-workspace.yaml`, pnpm resolves `@byarcadia-app/plutus` via workspace protocol internally. The lockfile retains `workspace:*`, causing a specifier mismatch that fails `--frozen-lockfile` in CI.

## Goals / Non-Goals

**Goals:**

- Restore CI by aligning the dependency specifier in `example/package.json` with the lockfile
- Ensure the example app always consumes the local library source during development

**Non-Goals:**

- Removing the example from the workspace (would break `pnpm --filter` commands and CI validation)
- Publishing workflow changes

## Decisions

**Use `workspace:*` for the example dependency.**
The standard pnpm monorepo pattern is for workspace members to reference sibling packages via `workspace:*`. pnpm automatically resolves this to the local package during development and substitutes the real version on publish. Pinning to `0.1.0` fights the workspace resolution and creates lockfile drift.

## Risks / Trade-offs

- [Risk] Future commits might re-pin to a published version → The CLAUDE.md validation command (`pnpm install --frozen-lockfile` in CI) will catch this immediately.
