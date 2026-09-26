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
    onCustomerInfoUpdated: (info, { isPro, isInTrial, expirationDate }) => {
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

| Callback                | Type                                                                                                          | Description                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `onError`               | `(error: PlutusError) => void`                                                                                | Called on SDK errors — see [Errors](./errors.md) for every code   |
| `onCustomerInfoUpdated` | `(info: CustomerInfo, state: { isPro: boolean; isInTrial: boolean; expirationDate: string \| null }) => void` | Called whenever customer info arrives, the start-up read included |
| `onTrackEvent`          | `(name: string, params?: Record<string, unknown>) => void`                                                    | Analytics event callback — every hook reports through it          |

Callbacks may be passed inline. The provider reads the latest ones through a ref, so a new callbacks
object never re-initializes RevenueCat.

## Initialization

The provider configures RevenueCat once per `apiKey` and `logLevel`, then reads the person's customer
info right away:

1. `isReady` turns `true` when the SDK is configured — `useOfferings` starts loading then.
2. `isCustomerInfoLoaded` turns `true` when customer info arrives — from the start-up read or from
   the SDK's listener, whichever comes first. A start-up read overtaken by the listener is dropped.
3. If the SDK cannot start (empty `apiKey`, or `configure` throws), `initError` holds the
   `INIT_FAILED` error and `isReady` stays `false`; `useOfferings` then stops loading and reports it.
