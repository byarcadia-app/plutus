## 1. Community Standard Files

- [x] 1.1 Create `CODE_OF_CONDUCT.md` at project root with Contributor Covenant v2.1, contact: contact@byarcadia.app
- [x] 1.2 Create `SECURITY.md` at project root with vulnerability disclosure policy, supported versions table (0.x), contact: contact@byarcadia.app, response timeline

> Files created manually to avoid content-filter issues during generation.

## 2. CI Pipeline

- [x] 2.1 Add `pnpm fmt:check` step to `.github/workflows/ci.yaml` after the build step
- [x] 2.2 Add `pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit` step to `.github/workflows/ci.yaml` after the build step

## 3. Verification

- [x] 3.1 Run full validation: `pnpm check && pnpm lint && pnpm fmt:check && pnpm build && pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit`
- [x] 3.2 Visually inspect CI YAML for correct structure and step ordering
