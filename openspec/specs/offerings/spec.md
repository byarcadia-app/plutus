## ADDED Requirements

### Requirement: useOfferings loads RevenueCat offerings

The `useOfferings` hook SHALL load offerings from RevenueCat when the provider is ready. It SHALL use the offering identifiers from the provider config (`offerings.default` and `offerings.rescue`) to resolve packages. It SHALL accept an optional `refetchKey` parameter.

#### Scenario: Offerings loaded successfully

- **WHEN** the provider is ready and `useOfferings` is mounted
- **THEN** it SHALL fetch offerings and expose `monthlyOffer`, `annualOffer`, and `rescueOffer` as `PurchasesPackage | undefined`

#### Scenario: Offerings loading state

- **WHEN** the hook first renders, and while a fetch (including the trial eligibility check) is in flight
- **THEN** `isLoading` SHALL be `true`, and SHALL become `false` after the fetch completes (success or error)

#### Scenario: SDK initialization failed

- **WHEN** the provider's `initError` is set
- **THEN** `isLoading` SHALL be `false` and `error` SHALL be that `initError`

#### Scenario: Offerings fetch error

- **WHEN** fetching offerings fails
- **THEN** the provider's `callbacks.onError` callback SHALL be called with `code: "OFFERINGS_FAILED"`, `error` SHALL hold the same error, and offers SHALL remain `undefined`

#### Scenario: Stale response

- **WHEN** a fetch settles after a newer fetch started or after the hook unmounted
- **THEN** its result SHALL be ignored

### Requirement: useOfferings detects per-package trial availability

The hook SHALL expose `monthlyHasTrial` and `annualHasTrial`. A package has a trial when its `product.introPrice` is non-null with `introPrice.price === 0` and, on iOS, `Purchases.checkTrialOrIntroductoryPriceEligibility` reports `INTRO_ELIGIBILITY_STATUS_ELIGIBLE` for its product. Eligibility SHALL be requested only on iOS and only for packages with a free intro price; on other platforms the free intro price alone decides, because the SDK answers UNKNOWN there.

#### Scenario: Eligible for the free trial

- **WHEN** on iOS `annualOffer` has a free intro price and eligibility is `INTRO_ELIGIBILITY_STATUS_ELIGIBLE`
- **THEN** `annualHasTrial` SHALL be `true`

#### Scenario: Trial already used

- **WHEN** on iOS eligibility for the annual product is `INTRO_ELIGIBILITY_STATUS_INELIGIBLE`
- **THEN** `annualHasTrial` SHALL be `false`

#### Scenario: Eligibility unknown

- **WHEN** on iOS eligibility is `INTRO_ELIGIBILITY_STATUS_UNKNOWN`, or the product is missing from the answer
- **THEN** the trial SHALL NOT be reported

#### Scenario: Eligibility check fails

- **WHEN** on iOS `checkTrialOrIntroductoryPriceEligibility` rejects
- **THEN** both trial flags SHALL be `false` and `callbacks.onError` SHALL be called with `code: "TRIAL_ELIGIBILITY_FAILED"`

#### Scenario: No free intro price

- **WHEN** a package's `introPrice` is null or not free
- **THEN** its trial flag SHALL be `false` and its eligibility SHALL NOT be requested

#### Scenario: Other platforms

- **WHEN** `Platform.OS` is not `"ios"`
- **THEN** eligibility SHALL NOT be requested and a free intro price alone SHALL mean a trial

#### Scenario: Package not loaded yet

- **WHEN** `annualOffer` is `undefined`
- **THEN** `annualHasTrial` SHALL be `false`

### Requirement: useOfferings computes discount percentages

The hook SHALL compute and expose `annualDiscountPercentage` comparing monthly-to-annual price, and `rescueOffsetDiscountPercentage` comparing rescue-to-annual price. Both SHALL be `number | undefined`.

#### Scenario: Annual discount calculation

- **WHEN** both monthly and annual offers are available and monthly yearly cost exceeds annual yearly cost
- **THEN** `annualDiscountPercentage` SHALL be the floored percentage savings (e.g., `50` for 50% off)

#### Scenario: No discount available

- **WHEN** monthly yearly cost is less than or equal to annual yearly cost, or either offer is missing
- **THEN** `annualDiscountPercentage` SHALL be `undefined`

#### Scenario: Rescue discount calculation

- **WHEN** both rescue and annual offers are available and rescue yearly cost is less than annual yearly cost
- **THEN** `rescueOffsetDiscountPercentage` SHALL be the floored percentage savings

### Requirement: useOfferings refetches on key change

The hook SHALL accept an optional `refetchKey` (string or number). When this value changes, offerings SHALL be refetched. This allows consumers to trigger refetch on date change or other app-level events.

#### Scenario: Refetch on key change

- **WHEN** `refetchKey` changes from `"2024-01-01"` to `"2024-01-02"`
- **THEN** offerings SHALL be refetched from RevenueCat

### Requirement: useOfferings exposes its error and a refetch

The hook SHALL expose `error: PlutusError | null` — the error that stopped offerings from loading, or the provider's `initError` — and `refetch()`, which fetches the offerings again.

#### Scenario: Retry after a failed fetch

- **WHEN** a fetch failed and `refetch()` is called
- **THEN** offerings SHALL be fetched again, and on success `error` SHALL be `null`
