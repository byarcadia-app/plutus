## Context

Plutus 0.1.1 is the RevenueCat layer of Pandora and, next, Grateful Me v2. The fixes below change
what it reports, so they ship as 0.2.0 behind the 0.x caret: nobody moves without choosing to. The
0.1.1 behaviour is pinned by tests whose names say "changes in 0.2.0"; this change flips them.

## Goals / Non-Goals

**Goals:**

- Never promise a trial a person cannot get.
- Never show an empty or free state that is only a race.
- Keep the public API additive and the peer range at `react-native-purchases >=9`.

**Non-Goals:**

- Treating `PAYMENT_PENDING_ERROR` apart from other errors.
- An `onPurchaseCancelled` callback — the tracking event covers analytics.
- The pre-existing drift between the specs and the code (the `apiKey` object form, `originalError`,
  hook-level `onTrackEvent`), except inside the requirements this change rewrites.

## Decisions

### 1. Eligibility on iOS only, and only for a free intro offer

`checkTrialOrIntroductoryPriceEligibility` exists in react-native-purchases 9 and 10, and on Android
it always answers UNKNOWN. So the call is made only when `Platform.OS === "ios"` — the one platform
branch in the package, kept because the SDK itself behaves per platform — and only for packages whose
intro price is 0. A trial needs both a free intro price and ELIGIBLE; UNKNOWN, INELIGIBLE, a missing
entry or a failed call mean no trial, and the failure is reported as `TRIAL_ELIGIBILITY_FAILED`.
Showing the plain price when unsure is RevenueCat's own recommendation.

### 2. `isReady` keeps its meaning; `isCustomerInfoLoaded` is new

The spec defines `isReady` as "the SDK is configured", and consumers gate on it. Changing it to "the
entitlement is known" would delay every screen that waits on it. The provider instead calls
`getCustomerInfo()` right after configuring and adds `isCustomerInfoLoaded`, true after the first
customer info from either the call or the listener. A result that arrives after a listener update is
dropped as stale. If the call fails, `CUSTOMER_INFO_FAILED` is reported and the flag waits for the
listener — consumers should not block their UI on it indefinitely.

### 3. `initError` makes a failed start visible

With `isLoading` starting `true`, a provider whose init failed would leave every paywall spinning,
because `isReady` never turns true. The provider exposes `initError`; `useOfferings` then reports
`isLoading: false` and `error: initError`.

### 4. Configure once; latest callbacks through a ref

The init effect depends only on `apiKey` and `logLevel`. `callbacks` and `entitlementName` live in a
ref updated in `useLayoutEffect`, and the listener reads the ref, so a new callbacks object never
re-configures and an entitlement-name change is still honoured. `useEffectEvent` would be neater but
needs React 19.2, and the example app runs 19.1. The context's `onTrackEvent` / `onError` become
stable wrappers, so the context value no longer changes identity on every render.

### 5. `false` is an error, `undefined` is a cancel

`purchasePackage` keeps its `Promise<boolean | undefined>` type. `undefined` now means only "the
person cancelled"; a store error resolves `false`, like a purchase that left the entitlement
inactive. The paywall hooks branch on that: a cancel tracks `paywall_purchase_cancelled` and calls
no failure callback.

## Risks / Trade-offs

- **Analytics continuity** → a consumer's `paywall_purchase_failed` count drops by the cancels. The
  changeset says so.
- **More reported errors** → the two new codes reach a consumer's error reporter, e.g. a fresh
  install offline. They are real failures, not noise.
- **Exhaustive switches** → a `switch` over `PlutusErrorCode` with a `never` check stops compiling.
  Acceptable in a 0.x minor and named in the changeset.
