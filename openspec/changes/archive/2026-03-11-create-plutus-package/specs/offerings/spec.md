## ADDED Requirements

### Requirement: useOfferings loads RevenueCat offerings
The `useOfferings` hook SHALL load offerings from RevenueCat when the provider is ready. It SHALL use the offering identifiers from the provider config (`offerings.default` and `offerings.rescue`) to resolve packages. It SHALL accept an optional `refetchKey` parameter.

#### Scenario: Offerings loaded successfully
- **WHEN** the provider is ready and `useOfferings` is mounted
- **THEN** it SHALL fetch offerings and expose `monthlyOffer`, `annualOffer`, and `rescueOffer` as `PurchasesPackage | undefined`

#### Scenario: Offerings loading state
- **WHEN** offerings are being fetched
- **THEN** `isLoading` SHALL be `true`, and SHALL become `false` after fetch completes (success or error)

#### Scenario: Offerings fetch error
- **WHEN** fetching offerings fails
- **THEN** the provider's `callbacks.onError` callback SHALL be called with the error and offers SHALL remain `undefined`

### Requirement: useOfferings detects per-package trial availability
The hook SHALL expose `monthlyHasTrial` and `annualHasTrial` boolean values derived from checking whether the package's `product.introPrice` is non-null and `introPrice.price === 0` (indicating a free trial). This is Level 1 detection only — no eligibility API calls.

#### Scenario: Annual package has trial configured
- **WHEN** `annualOffer.product.introPrice` is non-null and `introPrice.price === 0`
- **THEN** `annualHasTrial` SHALL be `true`

#### Scenario: Monthly package has no trial
- **WHEN** `monthlyOffer.product.introPrice` is null
- **THEN** `monthlyHasTrial` SHALL be `false`

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
