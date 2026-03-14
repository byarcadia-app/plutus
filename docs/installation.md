# Installation

@byarcadia-app/plutus wraps RevenueCat for React Native in-app purchases. Installation means adding the library and its peer dependency.

### 1. Install @byarcadia-app/plutus

```bash
pnpm add @byarcadia-app/plutus
```

### 2. Install peer dependency

```bash
pnpm add react-native-purchases
```

Follow [RevenueCat's setup guide](https://docs.revenuecat.com/docs/getting-started) for native configuration (App Store Connect, Play Console, API keys).

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
