## ADDED Requirements

### Requirement: usePaywall orchestrates standard paywall purchase flow

The `usePaywall` hook SHALL accept `monthlyOffer`, `annualOffer` (both `PurchasesPackage | undefined`), and optional callbacks: `onClose`, `onPurchaseSuccess(subscriptionType)`, `onPurchaseFailed`, `onRestoreSuccess`, `onRestoreFailed`, `onTrackEvent(name, params)`, `termsUrl`, `privacyUrl`. It SHALL manage `subscriptionType` state (defaulting to `"annual"`) and `isPurchasing` state. When `onTrackEvent` is not provided, it SHALL fall back to the provider-level `onTrackEvent`.

#### Scenario: Purchase annual package

- **WHEN** `handlePurchasePackage` is called with `subscriptionType` set to `"annual"`
- **THEN** the annual offer SHALL be purchased via `purchasePackage`, `isPurchasing` SHALL be `true` during the operation, and `onPurchaseSuccess("annual")` SHALL be called on success

#### Scenario: Purchase monthly package

- **WHEN** `handlePurchasePackage` is called with `subscriptionType` set to `"monthly"`
- **THEN** the monthly offer SHALL be purchased via `purchasePackage`

#### Scenario: Purchase fails

- **WHEN** `handlePurchasePackage` is called and the purchase does not succeed
- **THEN** `onPurchaseFailed` SHALL be called and `isPurchasing` SHALL be set to `false`

#### Scenario: Offers not available

- **WHEN** `handlePurchasePackage` is called but `monthlyOffer` or `annualOffer` is `undefined`
- **THEN** the function SHALL return early without attempting a purchase

#### Scenario: Restore purchases from paywall

- **WHEN** `handleRestorePurchases` is called
- **THEN** it SHALL call `restorePurchases` from the provider, call `onRestoreSuccess` if entitlement restored, or `onRestoreFailed` if not

#### Scenario: Subscription type toggle

- **WHEN** `handleSubscriptionTypeChange("monthly")` is called
- **THEN** `subscriptionType` SHALL update to `"monthly"` and `onTrackEvent` SHALL be called with event name and type

#### Scenario: Tracking falls back to provider

- **WHEN** `usePaywall` is called without `onTrackEvent` but the provider has `callbacks.onTrackEvent`
- **THEN** all tracking calls within the hook SHALL use the provider-level callback

### Requirement: usePaywall exposes legal link handlers

The hook SHALL accept `termsUrl` and `privacyUrl` strings in its config. It SHALL expose `handleTermsPress` and `handlePrivacyPress` that open these URLs via `Linking.openURL` and call `onTrackEvent`.

#### Scenario: Terms link pressed

- **WHEN** `handleTermsPress` is called and `termsUrl` is provided
- **THEN** the URL SHALL be opened via `Linking.openURL` and `onTrackEvent("paywall_terms_pressed")` SHALL be called

#### Scenario: Privacy link pressed

- **WHEN** `handlePrivacyPress` is called and `privacyUrl` is provided
- **THEN** the URL SHALL be opened via `Linking.openURL` and `onTrackEvent("paywall_privacy_pressed")` SHALL be called

### Requirement: useRescuePaywall orchestrates rescue offer purchase flow

The `useRescuePaywall` hook SHALL accept `rescueOffer` (`PurchasesPackage | undefined`), and optional callbacks: `onClose`, `onPurchaseSuccess`, `onPurchaseFailed`, `onRestoreSuccess`, `onRestoreFailed`, `onTrackEvent(name, params)`, `termsUrl`, `privacyUrl`. It SHALL manage `isPurchasing` state. When `onTrackEvent` is not provided, it SHALL fall back to the provider-level `onTrackEvent`.

#### Scenario: Purchase rescue offer

- **WHEN** `handlePurchasePackage` is called with a valid `rescueOffer`
- **THEN** the rescue offer SHALL be purchased, `onTrackEvent` SHALL be called with `is_rescue_offer: true`, and `onPurchaseSuccess` SHALL be called on success

#### Scenario: Rescue offer not available

- **WHEN** `handlePurchasePackage` is called but `rescueOffer` is `undefined`
- **THEN** the function SHALL return early without attempting a purchase

#### Scenario: Close rescue paywall

- **WHEN** `handleClosePress` is called
- **THEN** `onClose` SHALL be called and `onTrackEvent` SHALL be called with close event data

#### Scenario: Tracking falls back to provider

- **WHEN** `useRescuePaywall` is called without `onTrackEvent` but the provider has `callbacks.onTrackEvent`
- **THEN** all tracking calls within the hook SHALL use the provider-level callback
