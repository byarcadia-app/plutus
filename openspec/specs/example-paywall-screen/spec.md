### Requirement: Root layout with providers
The app's root layout SHALL wrap the application with `AetherProvider` (from aether-ui) and `PlutusProvider` (from plutus), passing RevenueCat configuration from environment variables.

#### Scenario: Providers initialize
- **WHEN** the app launches
- **THEN** `PlutusProvider` initializes RevenueCat with the configured API key and entitlement name

### Requirement: Home screen
The app SHALL have a home screen that displays the app name, a brief description, and a button to navigate to the paywall screen.

#### Scenario: Home screen renders
- **WHEN** the app opens
- **THEN** a home screen is displayed with app title "Plutus Example" and a "Show Paywall" button

#### Scenario: Navigation to paywall
- **WHEN** the user taps "Show Paywall"
- **THEN** the paywall screen is displayed

### Requirement: Paywall screen with offerings
The paywall screen SHALL use `useOfferings` to fetch available subscription packages and display monthly and annual options with pricing.

#### Scenario: Offerings load and display
- **WHEN** the paywall screen opens
- **THEN** it shows a loading state, then displays monthly and annual subscription options with their prices

#### Scenario: Annual discount shown
- **WHEN** both monthly and annual offerings are available
- **THEN** the annual discount percentage is displayed

### Requirement: Subscription purchase flow
The paywall screen SHALL use `usePaywall` to handle subscription type selection and purchase.

#### Scenario: User selects subscription type
- **WHEN** the user taps on monthly or annual option
- **THEN** that option becomes visually selected

#### Scenario: User initiates purchase
- **WHEN** the user taps the "Subscribe" button with a selected plan
- **THEN** the RevenueCat purchase flow is initiated and a loading state is shown

### Requirement: Restore purchases
The paywall screen SHALL include a "Restore Purchases" option that calls the restore flow from `usePlutus`.

#### Scenario: User restores purchases
- **WHEN** the user taps "Restore Purchases"
- **THEN** the restore flow is initiated via PlutusProvider

### Requirement: Pro status display
The home screen SHALL display the current subscription status using `usePlutus` context (whether the user is pro, in trial, etc.).

#### Scenario: Free user status
- **WHEN** the user has no active subscription
- **THEN** the home screen shows "Free" status

#### Scenario: Pro user status
- **WHEN** the user has an active subscription
- **THEN** the home screen shows "Pro" status
