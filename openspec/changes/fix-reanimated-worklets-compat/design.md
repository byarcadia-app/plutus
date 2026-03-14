## Context

The example app uses `react-native-reanimated@4.1.5`, which ships a `compatibility.json` allowing only `react-native-worklets` 0.5.x–0.6.x. pnpm resolves worklets 0.7.4 (the latest), causing the `RNReanimated.podspec` validation script to abort `pod install`.

## Goals / Non-Goals

**Goals:**

- Restore the ability to build the example app on iOS (`pnpm ios`)
- Keep dependencies on latest stable releases where possible

**Non-Goals:**

- Upgrading React Native or Expo SDK
- Changing any library source code

## Decisions

### Upgrade reanimated to 4.2.2

`react-native-reanimated@4.2.2` declares `react-native-worklets >= 0.7.0` as its peer dependency, which matches the resolved 0.7.4. This is a minor version bump within the same major, and is the latest stable release.

**Alternative considered:** Pin `react-native-worklets` to 0.6.x in `example/package.json`. Rejected because it would hold back a transitive dependency and future updates would hit the same wall.

## Risks / Trade-offs

- [Risk] Reanimated 4.2.x could have subtle behavioral changes → Mitigated by running the example app after upgrade and verifying the paywall screen works.
- [Risk] Lockfile churn → Acceptable for a dependency fix.
