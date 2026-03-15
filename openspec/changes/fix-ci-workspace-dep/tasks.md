## 1. Fix dependency specifier

- [x] 1.1 Change `@byarcadia-app/plutus` in `example/package.json` from `"0.1.0"` to `"workspace:*"`
- [x] 1.2 Run `pnpm install` to regenerate `pnpm-lock.yaml`

## 2. Verify

- [x] 2.1 Run `pnpm check && pnpm lint && pnpm fmt:check && pnpm build && pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit` to confirm everything passes
