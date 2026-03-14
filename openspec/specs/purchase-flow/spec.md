## ADDED Requirements

### Requirement: purchasePackage executes a purchase and returns result

The `purchasePackage` function exposed by `usePlutus` SHALL accept a `PurchasesPackage` and attempt to purchase it via RevenueCat SDK. It SHALL return `true` if the purchase resulted in the configured entitlement becoming active, and `false`/`undefined` otherwise.

#### Scenario: Successful purchase

- **WHEN** `purchasePackage` is called with a valid package and the purchase succeeds
- **THEN** it SHALL return `true`, update `isPro` to `true`, and call `callbacks.onCustomerInfoUpdated` with the new customer info

#### Scenario: User cancels purchase

- **WHEN** the user cancels the purchase dialog (error code `PURCHASE_CANCELLED_ERROR`)
- **THEN** the function SHALL return `undefined` silently without calling `callbacks.onError`

#### Scenario: Purchase error

- **WHEN** a non-cancellation purchase error occurs
- **THEN** the `callbacks.onError` callback SHALL be called with a structured error object containing `code: "PURCHASE_FAILED"`, `originalError` (the `PurchasesError`), and `package` (the attempted `PurchasesPackage`), and the function SHALL return `undefined`

### Requirement: restorePurchases restores previous purchases

The `restorePurchases` function exposed by `usePlutus` SHALL call `Purchases.restorePurchases()` and return `true` if the configured entitlement is found in the restored customer info, `false` otherwise.

#### Scenario: Successful restore with active entitlement

- **WHEN** `restorePurchases` is called and the restored customer info contains the configured entitlement
- **THEN** it SHALL return `true` and update `isPro` to `true`

#### Scenario: Restore with no active entitlement

- **WHEN** `restorePurchases` is called and the restored customer info does not contain the configured entitlement
- **THEN** it SHALL return `false` and `isPro` SHALL remain unchanged
