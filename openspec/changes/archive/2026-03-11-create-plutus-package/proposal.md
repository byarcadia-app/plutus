## Why

React Native apps with in-app purchases require repetitive RevenueCat setup — initialization, entitlement checking, offering loading, purchase flows, and restore logic. This boilerplate is error-prone and tightly coupled to app-specific concerns (alerts, logging, navigation). `@byarcadia-app/plutus` extracts this into a reusable, highly configurable package that encapsulates RevenueCat integration while exposing callbacks for app-specific behavior (analytics, error reporting, haptics, navigation).

## What Changes

- New `@byarcadia-app/plutus` npm package (React Native, Expo-compatible)
- `PlutusProvider` — context provider handling RevenueCat SDK initialization, customer info updates, and entitlement state management
- `useRevenueCat` hook — access to subscription status (`isPro`, `isInTrial`), `purchasePackage`, `restorePurchases`, `managementURL`
- `useOfferings` hook — loads and exposes available packages (monthly, annual, rescue/discount) with computed discount percentages
- `usePaywall` hook — purchase flow orchestration with subscription type selection, configurable callbacks for success/failure/close/analytics
- `useRescuePaywall` hook — rescue/discount offer purchase flow with same callback pattern
- All app-specific concerns (alerts, logging, haptics, navigation, analytics) exposed via callbacks/configuration — not baked in
- Package structure mirrors `@byarcadia-app/aether` conventions (tsup build, dual CJS/ESM, TypeScript declarations)

## Capabilities

### New Capabilities
- `provider-and-init`: PlutusProvider setup, RevenueCat SDK configuration, customer info listener, entitlement state management
- `purchase-flow`: Package purchasing, restore purchases, error handling with configurable callbacks
- `offerings`: Loading and exposing RevenueCat offerings with discount calculations
- `paywall-hooks`: usePaywall and useRescuePaywall hooks for orchestrating paywall purchase UX with configurable callbacks

### Modified Capabilities
<!-- No existing capabilities to modify — this is a new package -->

## Impact

- **New package**: `@byarcadia-app/plutus` at `/Users/dominik.wozniak/workspace/private/byarcadia-packages/plutus`
- **Peer dependencies**: `react`, `react-native`, `react-native-purchases`
- **Consumers**: Any React Native / Expo app needing RevenueCat integration (starting with grateful-me-app-v2, future apps)
- **Build tooling**: tsup (matching aether-ui conventions)
- **No breaking changes**: Greenfield package, existing app code unaffected until migration
