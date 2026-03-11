<h1 align="center">@byarcadia-app/plutus</h1>

<p align="center">
  Reusable <a href="https://www.revenuecat.com/">RevenueCat</a> wrapper for <a href="https://reactnative.dev/">React Native</a> in-app purchases — configurable, callback-driven, zero app-specific dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@byarcadia-app/plutus"><img src="https://img.shields.io/npm/v/@byarcadia-app/plutus?style=flat" alt="npm version" /></a>&nbsp;<a href="https://github.com/byarcadia-app/plutus/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@byarcadia-app/plutus?style=flat" alt="License" /></a>&nbsp;<img src="https://img.shields.io/badge/status-alpha-orange?style=flat" alt="Alpha" />
</p>

Named after the Greek god of wealth — Plutus wraps RevenueCat so you can set up in-app purchases once and reuse across projects.

## Features

- **PlutusProvider** — RevenueCat SDK initialization, customer info listener, entitlement state management
- **usePlutus** — Access `isPro`, `isInTrial`, `isReady`, `managementURL`, `purchasePackage`, `restorePurchases`
- **useOfferings** — Load offerings with configurable identifiers, per-package trial detection (`monthlyHasTrial`, `annualHasTrial`), computed discount percentages
- **usePaywall** — Purchase flow orchestration with subscription type selection, configurable callbacks
- **useRescuePaywall** — Rescue/discount offer purchase flow
- **Callback-driven** — All app-specific concerns (analytics, alerts, navigation, haptics) via callbacks, not baked in
- **Configurable** — Entitlement names, offering identifiers, API keys (per-platform), log level, translations
- **English fallback translations** — Ship with defaults, override with `Partial<PlutusTranslations>`

## Installation

```sh
pnpm add @byarcadia-app/plutus react-native-purchases
```

`react-native-purchases` is a peer dependency — follow [RevenueCat's setup guide](https://docs.revenuecat.com/docs/getting-started) for native configuration.

## Quick Start

```tsx
import { PlutusProvider, usePlutus, useOfferings, usePaywall } from "@byarcadia-app/plutus";

// 1. Wrap your app
function App() {
  return (
    <PlutusProvider
      apiKey="your_revenuecat_api_key"
      entitlementName="Pro"
      callbacks={{
        onError: (error) => console.error(error.code, error.originalError),
        onCustomerInfoUpdated: (info, { isPro }) => {
          if (isPro) saveProStatus(true);
        },
        onTrackEvent: (name, params) => analytics.track(name, params),
      }}
    >
      <YourApp />
    </PlutusProvider>
  );
}

// 2. Check subscription status anywhere
function PremiumGate({ children }) {
  const { isPro } = usePlutus();
  if (!isPro) return <PaywallScreen />;
  return children;
}

// 3. Load offerings and show paywall
function PaywallScreen() {
  const { monthlyOffer, annualOffer, annualHasTrial, annualDiscountPercentage } = useOfferings();

  const {
    subscriptionType,
    isPurchasing,
    handleSubscriptionTypeChange,
    handlePurchasePackage,
    handleRestorePurchases,
  } = usePaywall({
    monthlyOffer,
    annualOffer,
    onPurchaseSuccess: (type) => router.back(),
    onTrackEvent: (name, params) => analytics.track(name, params),
    termsUrl: "https://example.com/terms",
    privacyUrl: "https://example.com/privacy",
  });

  return (
    // Your paywall UI using the above state and handlers
  );
}
```

## API Reference

### PlutusProvider

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string \| { apple?: string; google?: string }` | Yes | RevenueCat API key |
| `entitlementName` | `string` | Yes | Entitlement identifier to check |
| `logLevel` | `LOG_LEVEL` | No | RevenueCat SDK log level (default: `ERROR`) |
| `offerings` | `{ default?: string; rescue?: string }` | No | Offering identifiers (defaults: `"default"`, `"rescue"`) |
| `callbacks` | `PlutusCallbacks` | No | `onError`, `onCustomerInfoUpdated`, `onTrackEvent` |
| `translations` | `Partial<PlutusTranslations>` | No | Override English default strings |

### usePlutus()

Returns: `{ isPro, isInTrial, isReady, managementURL, purchasePackage, restorePurchases, translations }`

### useOfferings(options?)

Options: `{ refetchKey?: string | number }`

Returns: `{ isLoading, monthlyOffer, annualOffer, rescueOffer, monthlyHasTrial, annualHasTrial, annualDiscountPercentage, rescueOffsetDiscountPercentage }`

### usePaywall(options)

Options: `{ monthlyOffer, annualOffer, onClose, onPurchaseSuccess, onPurchaseFailed, onRestoreSuccess, onRestoreFailed, onTrackEvent, termsUrl, privacyUrl }`

Returns: `{ subscriptionType, isPurchasing, handleSubscriptionTypeChange, handlePurchasePackage, handleRestorePurchases, handleClosePress, handleTermsPress, handlePrivacyPress }`

### useRescuePaywall(options)

Options: `{ rescueOffer, onClose, onPurchaseSuccess, onPurchaseFailed, onRestoreSuccess, onRestoreFailed, onTrackEvent, termsUrl, privacyUrl }`

Returns: `{ isPurchasing, handlePurchasePackage, handleRestorePurchases, handleClosePress, handleTermsPress, handlePrivacyPress }`

## Requirements

| Dependency | Version |
| --- | --- |
| React | >= 18 |
| React Native | >= 0.72 |
| react-native-purchases | >= 8 |

## License

MIT
