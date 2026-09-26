## MODIFIED Requirements

### Requirement: purchasePackage executes a purchase and returns result

The `purchasePackage` function exposed by `usePlutus` SHALL accept a `PurchasesPackage` and attempt to purchase it via RevenueCat SDK. It SHALL return `true` if the purchase resulted in the configured entitlement becoming active, `false` if it did not or if the store failed, and `undefined` only when the person cancelled.

#### Scenario: Successful purchase

- **WHEN** `purchasePackage` is called with a valid package and the purchase succeeds
- **THEN** it SHALL return `true`, update `isPro` to `true`, and call `callbacks.onCustomerInfoUpdated` with the new customer info

#### Scenario: User cancels purchase

- **WHEN** the user cancels the purchase dialog (error code `PURCHASE_CANCELLED_ERROR`)
- **THEN** the function SHALL return `undefined` silently without calling `callbacks.onError`

#### Scenario: Purchase error

- **WHEN** a non-cancellation purchase error occurs
- **THEN** the `callbacks.onError` callback SHALL be called with an error of `code: "PURCHASE_FAILED"` carrying the `PurchasesError` as `cause` and the attempted `PurchasesPackage` as `package`, and the function SHALL return `false`
