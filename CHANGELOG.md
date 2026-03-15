# @byarcadia-app/plutus

## 0.1.1

### Patch Changes

- [`3f4d540`](https://github.com/byarcadia-app/plutus/commit/3f4d540448c4de6a4fec3bb8b98726ec12f4ba23) Thanks [@dominikwozniak](https://github.com/dominikwozniak)! - Fix crash on launch when apiKey is empty — add validation guard before native SDK calls.

## 0.1.0

### Minor Changes

- Initial release
  - PlutusProvider with RevenueCat SDK initialization, customer info management, entitlement state
  - usePlutus hook for subscription status and purchase operations
  - useOfferings hook with configurable offering identifiers, per-package trial detection, discount calculations
  - usePaywall and useRescuePaywall hooks for purchase flow orchestration
  - Callback-driven architecture — all app-specific concerns (analytics, alerts, navigation) via callbacks
  - Configurable entitlement names, API keys (per-platform), offering identifiers, log level
  - English fallback translations with Partial<PlutusTranslations> override support
  - Structured PlutusError type with error codes for all failure scenarios
