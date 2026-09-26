# @byarcadia-app/plutus

## 0.2.0

### Minor Changes

- [#3](https://github.com/byarcadia-app/plutus/pull/3) [`686f9b0`](https://github.com/byarcadia-app/plutus/commit/686f9b046744e40dca43fd8a75449937411a7581) Thanks [@dominikwozniak](https://github.com/dominikwozniak)! - Trial eligibility, a known entitlement state at start, and a cancel told apart from a failure.

  **Behaviour changes — review before upgrading from 0.1.x:**

  - `useOfferings`: on iOS, `monthlyHasTrial` / `annualHasTrial` are `true` only when the product has a free intro price **and** the store answers ELIGIBLE for this person. UNKNOWN, INELIGIBLE, a missing answer or a failed check mean `false`. Other platforms keep the intro-price rule.
  - `useOfferings().isLoading` starts `true` and covers the offerings and the eligibility check; it is `false` at once, with `error` set, when the SDK failed to start.
  - `purchasePackage` resolves `false` on a store error (was `undefined`); `undefined` now means only that the person cancelled.
  - `usePaywall` / `useRescuePaywall`: a cancel tracks `paywall_purchase_cancelled` and no longer calls `onPurchaseFailed` or tracks `paywall_purchase_failed`.
  - `PlutusErrorCode` gains `CUSTOMER_INFO_FAILED` and `TRIAL_ELIGIBILITY_FAILED` — an exhaustive `switch` guarded by `never` needs a branch for each, and an error reporter wired to `onError` will see them.
  - `PlutusProvider` configures RevenueCat once per `apiKey` / `logLevel`; a new `callbacks` object no longer re-initializes the SDK, and the latest callbacks receive every event.

  **Additions:** `usePlutus()` exposes `isCustomerInfoLoaded`, `expirationDate` and `initError`; `useOfferings()` exposes `error` and `refetch()`; `onCustomerInfoUpdated`'s state includes `expirationDate`.

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
