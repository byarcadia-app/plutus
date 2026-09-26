## Why

Plutus is about to carry payments for Grateful Me v2, and a review of 0.1.1 found six places where
what it reports is not what is true:

- `annualHasTrial` / `monthlyHasTrial` say "free trial" whenever the product has a free intro price,
  even for a person who already used it. The App Store then charges them at once — a paywall that
  promises a free week and bills on day one.
- `useOfferings().isLoading` starts `false`, so the first frame of every paywall reads "no offers".
- `isReady` turns true right after `Purchases.configure`, and customer info is never requested, so a
  paying person can see the free state until the SDK happens to report.
- Passing `callbacks` inline re-runs `Purchases.configure` on every render of the provider — the
  example app does exactly that.
- Nothing exposes when the entitlement ends, so an app cannot remind a person before a trial renews.
- A cancelled purchase and a failed one both resolve `undefined`, so the paywall hooks report a
  cancel as a failure.

## What Changes

- **Trial eligibility (iOS):** `useOfferings` asks RevenueCat whether this person can still get each
  free intro offer; a trial is reported only when the answer is ELIGIBLE. Other platforms keep the
  intro-price rule.
- **Loading and errors in `useOfferings`:** `isLoading` starts `true`; it turns `false` when the fetch
  settles or when the SDK failed to initialize. New `error` and `refetch()`.
- **Customer info at start:** the provider requests customer info right after configuring and exposes
  `isCustomerInfoLoaded`. `isReady` keeps its meaning — the SDK is configured.
- **Configure once:** the SDK is configured once per `apiKey` / `logLevel`; callbacks and the
  entitlement name are read through a ref.
- **Entitlement end and init failure:** `usePlutus()` exposes `expirationDate` and `initError`;
  `onCustomerInfoUpdated`'s state gains `expirationDate`.
- **Cancel vs error:** `purchasePackage` resolves `false` on a store error and `undefined` on a
  cancel. The paywall hooks track `paywall_purchase_cancelled` and do not call `onPurchaseFailed` on
  a cancel.
- **New error codes:** `CUSTOMER_INFO_FAILED`, `TRIAL_ELIGIBILITY_FAILED`.

## Capabilities

### Modified Capabilities

- `offerings`: loading state, error and refetch; trial availability from eligibility on iOS
- `provider-and-init`: configure once, initial customer info, `isCustomerInfoLoaded`,
  `expirationDate`, `initError`
- `purchase-flow`: a store error resolves `false`
- `paywall-hooks`: a cancelled purchase is not a failure
- `ci-validation`: CI runs the test suite

## Impact

- **Release:** 0.2.0 (minor). `^0.1.1` never resolves to 0.2.0, so no consumer moves without an
  explicit bump. The changeset lists every behaviour change.
- **API:** only additions; no field is removed or narrowed. `PlutusErrorCode` gains two members, which
  breaks an exhaustive `switch` guarded by `never`.
- **Consumers:** Pandora (`^0.1.1`) is untouched until it upgrades; its analytics then see
  `paywall_purchase_cancelled` where `paywall_purchase_failed` used to be, and its error reporter sees
  the two new codes. Grateful Me v2 adopts 0.2.0 first.
- **Peer dependencies:** unchanged (`react-native-purchases >=9`); every SDK call used exists in 9.0.0.
