# @byarcadia-app/plutus

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
