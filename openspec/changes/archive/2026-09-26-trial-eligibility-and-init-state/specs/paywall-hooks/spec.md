## MODIFIED Requirements

### Requirement: usePaywall orchestrates standard paywall purchase flow

The `usePaywall` hook SHALL accept `monthlyOffer`, `annualOffer` (both `PurchasesPackage | undefined`), and optional callbacks: `onClose`, `onPurchaseSuccess(subscriptionType)`, `onPurchaseFailed`, `onRestoreSuccess`, `onRestoreFailed`, `termsUrl`, `privacyUrl`. It SHALL manage `subscriptionType` state (defaulting to `"annual"`) and `isPurchasing` state. It SHALL report events through the provider-level `onTrackEvent`.

#### Scenario: Purchase annual package

- **WHEN** `subscriptionType` is `"annual"` and `handlePurchasePackage` is called
- **THEN** the annual offer SHALL be purchased via `purchasePackage`, `isPurchasing` SHALL be `true` during the operation, and `onPurchaseSuccess("annual")` SHALL be called on success

#### Scenario: Purchase monthly package

- **WHEN** `subscriptionType` is `"monthly"` and `handlePurchasePackage` is called
- **THEN** the monthly offer SHALL be purchased via `purchasePackage`

#### Scenario: Purchase fails

- **WHEN** `purchasePackage` resolves `false`
- **THEN** `onPurchaseFailed` SHALL be called, `paywall_purchase_failed` SHALL be tracked, and `isPurchasing` SHALL be set to `false`

#### Scenario: Purchase cancelled

- **WHEN** `purchasePackage` resolves `undefined` because the person cancelled
- **THEN** `paywall_purchase_cancelled` SHALL be tracked with the subscription type, `onPurchaseFailed` SHALL NOT be called, and `isPurchasing` SHALL be set to `false`

#### Scenario: Offers not available

- **WHEN** `handlePurchasePackage` is called but `monthlyOffer` or `annualOffer` is `undefined`
- **THEN** the function SHALL return early without attempting a purchase

#### Scenario: Restore purchases from paywall

- **WHEN** `handleRestorePurchases` is called
- **THEN** it SHALL call `restorePurchases` from the provider, call `onRestoreSuccess` if entitlement restored, or `onRestoreFailed` if not

#### Scenario: Subscription type toggle

- **WHEN** `handleSubscriptionTypeChange("monthly")` is called
- **THEN** `subscriptionType` SHALL update to `"monthly"` and `onTrackEvent` SHALL be called with event name and type

### Requirement: useRescuePaywall orchestrates rescue offer purchase flow

The `useRescuePaywall` hook SHALL accept `rescueOffer` (`PurchasesPackage | undefined`), and optional callbacks: `onClose`, `onPurchaseSuccess`, `onPurchaseFailed`, `onRestoreSuccess`, `onRestoreFailed`, `termsUrl`, `privacyUrl`. It SHALL manage `isPurchasing` state and report events through the provider-level `onTrackEvent`.

#### Scenario: Purchase rescue offer

- **WHEN** `handlePurchasePackage` is called with a valid `rescueOffer`
- **THEN** the rescue offer SHALL be purchased, `onTrackEvent` SHALL be called with `is_rescue_offer: true`, and `onPurchaseSuccess` SHALL be called on success

#### Scenario: Rescue purchase cancelled

- **WHEN** `purchasePackage` resolves `undefined` because the person cancelled
- **THEN** `paywall_purchase_cancelled` SHALL be tracked with `is_rescue_offer: true` and `onPurchaseFailed` SHALL NOT be called

#### Scenario: Rescue offer not available

- **WHEN** `handlePurchasePackage` is called but `rescueOffer` is `undefined`
- **THEN** the function SHALL return early without attempting a purchase

#### Scenario: Close rescue paywall

- **WHEN** `handleClosePress` is called
- **THEN** `onClose` SHALL be called and `onTrackEvent` SHALL be called with close event data
