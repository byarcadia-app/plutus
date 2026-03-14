## ADDED Requirements

### Requirement: PlutusProvider initializes RevenueCat SDK

The `PlutusProvider` component SHALL configure and initialize the RevenueCat SDK using the provided `apiKey`. It SHALL accept a `PlutusConfig` object with required fields `apiKey` (string or `{ apple?: string; google?: string }`) and `entitlementName` (string), and optional fields: `logLevel` (LOG_LEVEL, defaults to `ERROR`), `offerings` config, `callbacks`, and `translations`.

#### Scenario: Successful initialization on iOS

- **WHEN** `PlutusProvider` mounts with a valid `apiKey`
- **THEN** RevenueCat SDK SHALL be configured with that API key, `Purchases.setLogLevel()` SHALL be called with the configured log level, and `isReady` SHALL become `true`

#### Scenario: Initialization error

- **WHEN** RevenueCat SDK configuration throws an error
- **THEN** the `callbacks.onError` callback SHALL be called with a structured error object containing `code: "INIT_FAILED"` and `originalError`, and `isReady` SHALL remain `false`

### Requirement: Provider accepts platform-specific configuration

The `PlutusConfig` SHALL accept `apiKey` as either a string or an object `{ apple?: string; google?: string }` to support multi-platform apps. The provider SHALL select the correct key based on `Platform.OS`.

#### Scenario: String API key on iOS

- **WHEN** `apiKey` is a string and platform is iOS
- **THEN** RevenueCat SHALL be configured with that string

#### Scenario: Platform-specific API keys

- **WHEN** `apiKey` is `{ apple: "key_a", google: "key_g" }` and platform is Android
- **THEN** RevenueCat SHALL be configured with `"key_g"`

### Requirement: PlutusProvider manages customer info updates

The provider SHALL register a `customerInfoUpdateListener` on mount and remove it on unmount. When customer info updates, the provider SHALL evaluate the configured `entitlementName` against active entitlements and update `isPro` and `isInTrial` state accordingly.

#### Scenario: Customer gains entitlement

- **WHEN** a customer info update arrives with the configured entitlement active
- **THEN** `isPro` SHALL be `true`

#### Scenario: Customer has trial entitlement

- **WHEN** a customer info update arrives with the configured entitlement active and `periodType` is `"TRIAL"`
- **THEN** `isPro` SHALL be `true` and `isInTrial` SHALL be `true`

#### Scenario: Customer info callback

- **WHEN** customer info updates
- **THEN** the `callbacks.onCustomerInfoUpdated` callback SHALL be called with the `CustomerInfo` object and the derived entitlement state (`isPro`, `isInTrial`)

### Requirement: Provider configures offering identifiers

The `PlutusConfig` SHALL accept an optional `offerings` object with `default` (string, defaults to `"default"`) and `rescue` (string, defaults to `"rescue"`) properties. These identifiers SHALL be used by `useOfferings` to resolve the correct offerings from RevenueCat.

#### Scenario: Custom offering identifiers

- **WHEN** `offerings: { default: "premium", rescue: "win-back" }` is provided
- **THEN** `useOfferings` SHALL look up `offerings.all["premium"]` and `offerings.all["win-back"]`

#### Scenario: Default offering identifiers

- **WHEN** no `offerings` config is provided
- **THEN** `useOfferings` SHALL look up `offerings.all["default"]` and `offerings.all["rescue"]`

### Requirement: Provider supports fallback translations with overrides

The `PlutusConfig` SHALL accept an optional `translations` of type `Partial<PlutusTranslations>`. Plutus SHALL ship English defaults for all consumer-facing strings. Any key provided in `translations` SHALL override the English default.

#### Scenario: Default English translations

- **WHEN** no `translations` config is provided
- **THEN** all consumer-facing strings SHALL use English defaults

#### Scenario: Partial translation override

- **WHEN** `translations: { purchaseError: { title: "Błąd zakupu" } }` is provided
- **THEN** `purchaseError.title` SHALL use the provided Polish string while all other strings SHALL use English defaults

### Requirement: Provider exposes global onTrackEvent callback

The `PlutusConfig.callbacks` SHALL accept an optional `onTrackEvent(name: string, params?: Record<string, unknown>)` callback. This callback SHALL be used as a default by all hooks unless overridden at the hook level.

#### Scenario: Global tracking callback used by hooks

- **WHEN** `callbacks.onTrackEvent` is set on the provider and `usePaywall` does not provide its own `onTrackEvent`
- **THEN** paywall events SHALL be reported through the provider-level `onTrackEvent`

#### Scenario: Hook-level tracking override

- **WHEN** both provider and `usePaywall` define `onTrackEvent`
- **THEN** the hook-level `onTrackEvent` SHALL be used instead of the provider-level one

### Requirement: usePlutus hook provides context access

The `usePlutus` hook SHALL return the provider's state and actions: `isPro`, `isInTrial`, `isReady`, `managementURL`, `purchasePackage`, `restorePurchases`, and `translations`. It SHALL throw an error if used outside of `PlutusProvider`.

#### Scenario: Hook used within provider

- **WHEN** `usePlutus` is called inside a `PlutusProvider`
- **THEN** it SHALL return the current entitlement state, purchase functions, and resolved translations

#### Scenario: Hook used outside provider

- **WHEN** `usePlutus` is called outside of a `PlutusProvider`
- **THEN** it SHALL throw an error with a descriptive message
