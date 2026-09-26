## MODIFIED Requirements

### Requirement: PlutusProvider initializes RevenueCat SDK

The `PlutusProvider` component SHALL configure and initialize the RevenueCat SDK using the provided `apiKey`. It SHALL accept a `PlutusConfig` object with required fields `apiKey` (string) and `entitlementName` (string), and optional fields: `logLevel` (LOG_LEVEL, defaults to `ERROR`), `offerings` config, `callbacks`, and `translations`. It SHALL configure the SDK once per `apiKey` and `logLevel`; a new `callbacks` object or `entitlementName` SHALL NOT configure it again, and the latest callbacks SHALL be the ones called.

#### Scenario: Successful initialization

- **WHEN** `PlutusProvider` mounts with a valid `apiKey`
- **THEN** `Purchases.setLogLevel()` SHALL be called with the configured log level, RevenueCat SHALL be configured with that API key, and `isReady` SHALL become `true`

#### Scenario: Initialization error

- **WHEN** the `apiKey` is empty, or RevenueCat SDK configuration throws
- **THEN** `callbacks.onError` SHALL be called with an error of `code: "INIT_FAILED"` carrying the thrown value as `cause`, `initError` SHALL hold that error, and `isReady` SHALL remain `false`

#### Scenario: Callbacks passed inline

- **WHEN** the provider re-renders with a new `callbacks` object
- **THEN** RevenueCat SHALL NOT be configured again, and later events SHALL reach the new callbacks

### Requirement: PlutusProvider manages customer info updates

The provider SHALL register a `customerInfoUpdateListener` on mount and remove it on unmount, and SHALL request `Purchases.getCustomerInfo()` right after configuring. For every customer info it receives it SHALL evaluate the configured `entitlementName` against active entitlements and update `isPro`, `isInTrial`, `expirationDate` and `managementURL`, and set `isCustomerInfoLoaded` to `true`.

#### Scenario: Customer info known at start

- **WHEN** `getCustomerInfo()` resolves with the configured entitlement active, before any listener update
- **THEN** `isPro` SHALL be `true` and `isCustomerInfoLoaded` SHALL be `true`

#### Scenario: Stale initial customer info

- **WHEN** a listener update arrives before `getCustomerInfo()` resolves
- **THEN** the `getCustomerInfo()` result SHALL be ignored

#### Scenario: Initial customer info fails

- **WHEN** `getCustomerInfo()` rejects
- **THEN** `callbacks.onError` SHALL be called with `code: "CUSTOMER_INFO_FAILED"` and `isCustomerInfoLoaded` SHALL stay `false` until a listener update arrives

#### Scenario: Customer gains entitlement

- **WHEN** a customer info update arrives with the configured entitlement active
- **THEN** `isPro` SHALL be `true` and `expirationDate` SHALL be the entitlement's `expirationDate`

#### Scenario: Customer has trial entitlement

- **WHEN** a customer info update arrives with the configured entitlement active and `periodType` is `"TRIAL"`
- **THEN** `isPro` SHALL be `true`, `isInTrial` SHALL be `true`, and `expirationDate` SHALL be the trial's end

#### Scenario: Customer info callback

- **WHEN** customer info updates
- **THEN** the `callbacks.onCustomerInfoUpdated` callback SHALL be called with the `CustomerInfo` object and the derived state (`isPro`, `isInTrial`, `expirationDate`)

### Requirement: usePlutus hook provides context access

The `usePlutus` hook SHALL return the provider's state and actions: `isPro`, `isInTrial`, `isReady`, `isCustomerInfoLoaded`, `expirationDate`, `initError`, `managementURL`, `purchasePackage`, `restorePurchases`, and `translations`. It SHALL throw an error if used outside of `PlutusProvider`.

#### Scenario: Hook used within provider

- **WHEN** `usePlutus` is called inside a `PlutusProvider`
- **THEN** it SHALL return the current entitlement state, purchase functions, and resolved translations

#### Scenario: Hook used outside provider

- **WHEN** `usePlutus` is called outside of a `PlutusProvider`
- **THEN** it SHALL throw an error with a descriptive message

## REMOVED Requirements

### Requirement: Provider accepts platform-specific configuration

**Reason:** `simplify-api-surface` (2026-03-12) made `apiKey` a string and removed the platform branch; the spec never followed. **Migration:** pass the platform's key as a string.
