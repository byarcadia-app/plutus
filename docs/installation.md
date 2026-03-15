# Installation

@byarcadia-app/plutus wraps RevenueCat for React Native in-app purchases. Installation means adding the library and its peer dependency.

### 1. Install @byarcadia-app/plutus

```bash
pnpm add @byarcadia-app/plutus
```

### 2. Install peer dependency

```bash
pnpm add react-native-purchases   # v9+ required
```

Follow the [Payment Setup guide](./payment-setup.md) for full iOS configuration with RevenueCat and App Store Connect. See also [RevenueCat's quickstart](https://www.revenuecat.com/docs/getting-started/quickstart) for general reference.

> **Tip:** For development and testing, you can use a RevenueCat [Test Store](https://www.revenuecat.com/docs/test-store) API key (prefixed with `test_`). This lets you test purchases without App Store Connect sandbox setup — just configure the Test Store in your RevenueCat dashboard.

## Quick Start

Wrap your app with `PlutusProvider` and pass your RevenueCat API key:

```tsx
import { PlutusProvider } from "@byarcadia-app/plutus";

export default function App() {
  return (
    <PlutusProvider
      apiKey="your_revenuecat_api_key"
      entitlementName="Pro"
      callbacks={{
        onError: (error) => console.error(error.code, error.message),
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
```

See [PlutusProvider](./provider.md) for all configuration options and [Hooks](./hooks.md) for consuming subscription state.
