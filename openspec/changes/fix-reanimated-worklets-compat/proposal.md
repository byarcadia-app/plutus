## Why

The example app fails to build on iOS because `react-native-reanimated@4.1.5` ships a compatibility matrix that only allows `react-native-worklets` 0.5.x or 0.6.x, but pnpm resolves 0.7.4 (the latest). The podspec validation script aborts `pod install`, blocking all iOS development.

## What Changes

- Upgrade `react-native-reanimated` in `example/package.json` to a version compatible with worklets 0.7.x (or pin worklets to 0.6.x if no compatible reanimated release exists yet)
- Re-run `pnpm install` and `pod install` to verify the fix
- Ensure `pnpm check` and the full validation suite pass

## Capabilities

### New Capabilities

_None_

### Modified Capabilities

- `example-app-setup`: Dependency versions change to resolve the reanimated/worklets compatibility conflict

## Impact

- `example/package.json` — dependency version bump
- `example/ios/Podfile.lock` — regenerated after successful pod install
- No library source changes — this is strictly an example app dependency fix
