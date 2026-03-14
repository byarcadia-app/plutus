# PlutusProvider

Root provider that initializes the RevenueCat SDK, manages entitlement state, and distributes configuration to all hooks.

## Import

```tsx
import { PlutusProvider } from "@byarcadia-app/plutus";
```

## Usage

```tsx
<PlutusProvider
  apiKey="your_revenuecat_api_key"
  entitlementName="Pro"
  logLevel={LOG_LEVEL.DEBUG}
  offerings={{ default: "default", rescue: "rescue" }}
  callbacks={{
    onError: (error) => console.error(error.code, error.message),
    onCustomerInfoUpdated: (info, { isPro, isInTrial }) => {
      analytics.setUserProperty("is_pro", isPro);
    },
    onTrackEvent: (name, params) => analytics.track(name, params),
  }}
  translations={{
    purchaseError: { title: "Oops!", message: "Something went wrong." },
  }}
>
  <App />
</PlutusProvider>
```

## API Reference

### Props

| Prop              | Type                                    | Required | Default                                    | Description                                                                                                                  |
| ----------------- | --------------------------------------- | -------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `apiKey`          | `string`                                | Yes      | —                                          | RevenueCat API key. An empty or whitespace-only value will not initialize the SDK and triggers `onError` with `INIT_FAILED`. |
| `entitlementName` | `string`                                | Yes      | —                                          | Entitlement identifier to check for pro/trial status                                                                         |
| `logLevel`        | `LOG_LEVEL`                             | No       | `LOG_LEVEL.ERROR`                          | RevenueCat SDK log level                                                                                                     |
| `offerings`       | `{ default?: string; rescue?: string }` | No       | `{ default: "default", rescue: "rescue" }` | Offering identifiers for default and rescue paywalls                                                                         |
| `callbacks`       | `PlutusCallbacks`                       | No       | —                                          | Event callbacks (see below)                                                                                                  |
| `translations`    | `Partial<PlutusTranslations>`           | No       | English defaults                           | Override default translation strings                                                                                         |

### Callbacks

| Callback                | Type                                                                          | Description                                               |
| ----------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| `onError`               | `(error: PlutusError) => void`                                                | Called on SDK errors (init, purchase, offerings, restore) |
| `onCustomerInfoUpdated` | `(info: CustomerInfo, state: { isPro: boolean; isInTrial: boolean }) => void` | Called when RevenueCat customer info changes              |
| `onTrackEvent`          | `(name: string, params?: Record<string, unknown>) => void`                    | Analytics event callback — used as fallback by all hooks  |

### Callback Hierarchy

Hooks accept their own `onTrackEvent` callback. When provided, the hook-level callback takes precedence over the provider-level `onTrackEvent`. This lets you customize analytics per-screen while keeping a global fallback.
