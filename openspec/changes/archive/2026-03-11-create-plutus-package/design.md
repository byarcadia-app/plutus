## Context

Currently, RevenueCat integration in grateful-me-app-v2 lives inside the app as tightly-coupled hooks (`useRevenueCat`, `useGetOfferings`, `usePaywall`, `useRescuePaywall`, `useShowPaywall`). These hooks depend on app-specific utilities (alerts, i18n, analytics, haptics, navigation via expo-router, MMKV storage). Every new app requires re-implementing this setup from scratch.

The `@byarcadia-app/aether` package already establishes conventions for shared packages: tsup build, dual CJS/ESM output, TypeScript declarations, peer dependencies for React Native / Expo.

## Goals / Non-Goals

**Goals:**
- Encapsulate RevenueCat SDK initialization and lifecycle management behind a React context provider
- Expose entitlement state (`isPro`, `isInTrial`, `isReady`) and purchase operations via hooks
- Provide offerings loading with per-package trial detection and computed discount calculations
- Make all app-specific concerns (analytics, error reporting, alerts, haptics, navigation) configurable via callbacks — zero hard-coded app dependencies
- Provide English fallback translations for error messages with full override capability
- Support configurable entitlement names, API keys, offering identifiers, and log levels
- Match `@byarcadia-app/aether` package conventions (build, exports, structure)
- Enable Umbra migration via config changes and minor code adjustments — no rewrite

**Non-Goals:**
- UI components for paywalls (consumers build their own UI, plutus provides the logic)
- Built-in haptics — consumers call haptics in their own event handlers
- Built-in navigation — consumers handle routing in `onClose`, `onPurchaseSuccess` callbacks
- Server-side receipt validation (RevenueCat handles this)
- Trial eligibility checking (Level 2 — `checkTrialOrIntroDiscountEligibility` API). Only Level 1 detection via `introPrice` on packages.

## Decisions

### 1. Provider + Context pattern (same as source code)

**Decision**: Use a `PlutusProvider` wrapping `React.createContext` with a `usePlutus` consumer hook.

**Rationale**: Matches the existing `useProvideRevenueCat` / `RevenueCatContext` pattern. Provider handles initialization and state; hooks consume it. Familiar to React Native developers.

**Alternatives considered**:
- Standalone functions (no context) — rejected because RevenueCat SDK state (customer info listener, ready state) needs to persist across the component tree
- Zustand/Jotai store — rejected as unnecessary external dependency for a focused package

### 2. Callback-based configuration with structured error data

**Decision**: `PlutusProvider` accepts a config object with optional callbacks: `onError(error)`, `onCustomerInfoUpdated(info, state)`, `onTrackEvent(name, params?)`. Paywall hooks accept per-hook callbacks (`onClose`, `onPurchaseSuccess`, `onPurchaseFailed`, `onRestoreSuccess`, `onRestoreFailed`, `onTrackEvent`) that override the provider-level `onTrackEvent` when provided.

Error callbacks receive structured data (error code, original error, context) — not translated strings. Consumers decide how to present errors to users.

**Rationale**: The source hooks hard-code `captureException`, `showAlert`, `trackEvent`, `hapticsImpact`, and expo-router navigation. These are all app-specific. Callbacks let consumers plug in their own implementations. Global `onTrackEvent` on provider with per-hook override gives flexibility without repetition.

**Alternatives considered**:
- Plugin/middleware system — over-engineered for the current scope
- Event emitter pattern — less ergonomic in React; callbacks compose better with hooks
- Per-hook only callbacks (no global) — rejected; too repetitive for tracking which is typically the same across hooks

### 3. Named offering slots (Approach A)

**Decision**: Provider config accepts `offerings?: { default?: string; rescue?: string }` with defaults `"default"` and `"rescue"`. `useOfferings` resolves packages from these two named offerings.

**Rationale**: Covers the primary use case (default offering with monthly/annual + rescue/discount offering). More complex setups can use `Purchases.getOfferings()` directly. Simple beats flexible here.

**Alternatives considered**:
- Generic offerings map with arbitrary slots — over-engineered for current needs
- Fully dynamic offering resolution — consumers who need this can bypass `useOfferings`

### 4. Per-package trial detection (Level 1)

**Decision**: `useOfferings` exposes `monthlyHasTrial` and `annualHasTrial` booleans derived from `package.product.introPrice !== null && introPrice.price === 0`. No eligibility API calls.

**Rationale**: Umbra uses trial presence to change paywall CTA ("Start free trial" vs "Subscribe"). The `introPrice` check on the package product is sufficient — it tells whether a trial is configured for that product. Whether the user has already used a trial is handled transparently by App Store / RevenueCat at purchase time.

**Alternatives considered**:
- `checkTrialOrIntroDiscountEligibility` API call — more accurate but adds async complexity and another loading state. Can be added later if needed.

### 5. English fallback translations with override

**Decision**: Plutus ships a `PlutusTranslations` type with English defaults for all consumer-facing strings (error messages, etc.). Consumers can pass `translations?: Partial<PlutusTranslations>` in config to override any or all strings.

**Rationale**: Zero-config experience for English apps. Multi-language apps pass their own translated strings. No i18n library dependency in the package.

### 6. Separate paywall hooks from core provider

**Decision**: Keep `usePaywall` and `useRescuePaywall` as separate hooks that compose on top of `usePlutus`, rather than baking purchase flow orchestration into the provider.

**Rationale**: Not every consumer needs the same paywall flow. The provider gives primitives (`purchasePackage`, `restorePurchases`); paywall hooks provide opinionated orchestration. Consumers can use the hooks or build their own flows.

### 7. tsup build matching aether conventions

**Decision**: Single entry point `src/index.ts`, tsup with CJS + ESM output, `react-native-purchases` as peer dependency.

**Rationale**: Consistency with `@byarcadia-app/aether`. Single entry point is sufficient — unlike aether (which has separate icon/tailwind entry points), plutus has a focused API surface.

### 8. No MMKV or persistent storage dependency

**Decision**: Remove the `mmkvStore.set(mmkvConfig.previousProStatus, true)` pattern from the source. If consumers want to persist pro status, they can do so in `onCustomerInfoUpdated` callback.

**Rationale**: MMKV is an app-specific storage choice. The package should not depend on any particular storage library.

### 9. logLevel in config

**Decision**: `PlutusConfig` accepts optional `logLevel?: LOG_LEVEL` (from `react-native-purchases`). Defaults to `LOG_LEVEL.ERROR`. Provider calls `Purchases.setLogLevel()` during initialization.

**Rationale**: Convenient for consumers who want debug logging without calling the SDK directly. Simple pass-through, no abstraction needed.

## Risks / Trade-offs

- **[RevenueCat SDK version coupling]** → Peer dependency on `react-native-purchases` with a semver range. Document tested versions. Breaking changes in RC SDK may require plutus updates.
- **[Callback ergonomics vs simplicity]** → Many callbacks could make initial setup verbose → Provide sensible defaults (no-ops) so minimal config works out of the box. Only `apiKey` and `entitlementName` are required.
- **[No built-in paywall UI]** → Consumers must build their own paywall screens → This is intentional. UI belongs in the app or a separate package. Plutus is logic-only.
- **[Trial detection accuracy]** → Level 1 `introPrice` check doesn't account for user eligibility → Acceptable trade-off. App Store handles this at purchase time. CTA may show "Start free trial" to users who already used one, but the purchase will still work (just charges immediately).
- **[Fallback translations maintenance]** → English defaults need updating when new error cases are added → Small surface area, acceptable.
