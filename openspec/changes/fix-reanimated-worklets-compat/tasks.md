## 1. Dependency Update

- [ ] 1.1 Update `react-native-reanimated` from `4.1.5` to `4.2.2` in `example/package.json`
- [ ] 1.2 Run `pnpm install` from workspace root to update lockfile

## 2. iOS Rebuild

- [ ] 2.1 Run `pod install` in `example/ios/` and verify it completes without errors

## 3. Validation

- [ ] 3.1 Run `pnpm check && pnpm lint && pnpm fmt:check && pnpm build && pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit`
- [ ] 3.2 Run `pnpm ios` from `example/` and verify the app launches on simulator
