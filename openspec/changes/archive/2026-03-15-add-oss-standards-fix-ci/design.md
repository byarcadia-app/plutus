## Context

Plutus is an open-source library published under @byarcadia-app. It currently has CONTRIBUTING.md and README.md but lacks CODE_OF_CONDUCT.md and SECURITY.md — both expected by the GitHub community standards checklist. The CI workflow (`.github/workflows/ci.yaml`) runs `check`, `lint`, and `build` but omits `fmt:check` and example app typechecking, both of which are required by CLAUDE.md's validation command.

## Goals / Non-Goals

**Goals:**

- Add community standard files so the repo meets GitHub's community profile expectations
- Align CI with the full validation command from CLAUDE.md: `pnpm check && pnpm lint && pnpm fmt:check && pnpm build && pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit`

**Non-Goals:**

- Modifying library source code or example app code
- Adding tests or test infrastructure
- Changing the build or release process

## Decisions

### Use Contributor Covenant v2.1 for Code of Conduct

**Rationale**: Industry standard, widely recognized, maintained by a dedicated community. GitHub auto-detects it for the community standards badge.

### Place security contact at contact@byarcadia.app

**Rationale**: Consistent with existing CONTRIBUTING.md contact information. Keeps a single point of contact for the organization.

### Add CI steps after `pnpm build` (not before)

**Rationale**: The existing step order matches dependency flow: typecheck → lint → build. Format checking is independent and goes after build. Example app typecheck depends on the library being built first (it imports from the package), so it MUST run after `pnpm build`.

## Risks / Trade-offs

- **[CI time increase]** → Minimal; `fmt:check` and `tsc --noEmit` are fast operations (~seconds each)
- **[Example typecheck may fail on existing PRs]** → If formatting or example types are already broken, enabling these checks will surface that immediately. This is the desired behavior — better to catch it now.
