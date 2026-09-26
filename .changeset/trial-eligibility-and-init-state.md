---
"@byarcadia-app/plutus": minor
---

Trial eligibility, a known entitlement state at start, and a cancel told apart from a failure.

**Behaviour changes — review before upgrading from 0.1.x:**

- `useOfferings`: on iOS, `monthlyHasTrial` / `annualHasTrial` are `true` only when the product has a free intro price **and** the store answers ELIGIBLE for this person. UNKNOWN, INELIGIBLE, a missing answer or a failed check mean `false`. Other platforms keep the intro-price rule.
- `useOfferings().isLoading` starts `true` and covers the offerings and the eligibility check; it is `false` at once, with `error` set, when the SDK failed to start.
- `purchasePackage` resolves `false` on a store error (was `undefined`); `undefined` now means only that the person cancelled.
- `usePaywall` / `useRescuePaywall`: a cancel tracks `paywall_purchase_cancelled` and no longer calls `onPurchaseFailed` or tracks `paywall_purchase_failed`.
- `PlutusErrorCode` gains `CUSTOMER_INFO_FAILED` and `TRIAL_ELIGIBILITY_FAILED` — an exhaustive `switch` guarded by `never` needs a branch for each, and an error reporter wired to `onError` will see them.
- `PlutusProvider` configures RevenueCat once per `apiKey` / `logLevel`; a new `callbacks` object no longer re-initializes the SDK, and the latest callbacks receive every event.

**Additions:** `usePlutus()` exposes `isCustomerInfoLoaded`, `expirationDate` and `initError`; `useOfferings()` exposes `error` and `refetch()`; `onCustomerInfoUpdated`'s state includes `expirationDate`.
