## Why

Plutus is a reusable RevenueCat wrapper library, but there's no runnable example showing how to integrate it. Developers (and ourselves) need a minimal reference app to validate the API, demonstrate usage patterns, and iterate on the library's DX. Following the same pattern as aether-ui's example app, we'll add an Expo example app within the monorepo.

## What Changes

- Add an `example/` directory with a minimal Expo React Native app
- Set up pnpm workspace to link `@byarcadia-app/plutus` as a local dependency
- Configure the example app with Expo Router, NativeWind, and the aether-ui design system
- Implement a minimal paywall screen demonstrating `PlutusProvider`, `useOfferings`, and `usePaywall`
- Add workspace-level scripts to run the example app

## Capabilities

### New Capabilities

- `example-app-setup`: Expo app scaffolding, pnpm workspace config, metro/babel/tailwind configuration, and workspace scripts
- `example-paywall-screen`: Minimal paywall UI demonstrating PlutusProvider integration, offerings display, and purchase flow

### Modified Capabilities

_None — this change adds a new example app without modifying existing library specs._

## Impact

- **New files**: `example/` directory with Expo app, `pnpm-workspace.yaml` at root
- **Modified files**: Root `package.json` (workspace scripts)
- **Dependencies**: Expo, Expo Router, NativeWind, `@byarcadia-app/aether`, `react-native-purchases` (peer dep satisfied in example)
- **No breaking changes** to the library itself
