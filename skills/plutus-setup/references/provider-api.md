# PlutusProvider API Reference

Full API for `PlutusProvider` — the root component that initializes RevenueCat and distributes state to all Plutus hooks.

## Import

```tsx
import { PlutusProvider } from "@byarcadia-app/plutus";
```

## Props

| Prop              | Type                                    | Required | Default                                    | Description                                                                                                     |
| ----------------- | --------------------------------------- | -------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `apiKey`          | `string`                                | Yes      | —                                          | RevenueCat API key. Empty or whitespace-only value skips SDK init and fires `onError` with `INIT_FAILED`.       |
| `entitlementName` | `string`                                | Yes      | —                                          | Entitlement identifier to check for pro/trial status. Case-sensitive — must match RevenueCat dashboard exactly. |
| `logLevel`        | `LOG_LEVEL`                             | No       | `LOG_LEVEL.ERROR`                          | RevenueCat SDK log level. Use `LOG_LEVEL.DEBUG` during development.                                             |
| `offerings`       | `{ default?: string; rescue?: string }` | No       | `{ default: "default", rescue: "rescue" }` | Offering identifiers for default and rescue paywalls.                                                           |
| `callbacks`       | `PlutusCallbacks`                       | No       | —                                          | Event callbacks (see below).                                                                                    |
| `translations`    | `Partial<PlutusTranslations>`           | No       | English defaults                           | Override default translation strings.                                                                           |

## Callbacks

| Callback                | Type                                                                                                          | Description                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `onError`               | `(error: PlutusError) => void`                                                                                | Called on SDK errors (init, customer info, purchase, offerings, trial eligibility, restore). |
| `onCustomerInfoUpdated` | `(info: CustomerInfo, state: { isPro: boolean; isInTrial: boolean; expirationDate: string \| null }) => void` | Called whenever customer info arrives, the start-up read included.                           |
| `onTrackEvent`          | `(name: string, params?: Record<string, unknown>) => void`                                                    | Analytics event callback — every hook reports through it.                                    |

## Callbacks inline

Callbacks may be passed inline: the provider reads the latest ones through a ref and configures
RevenueCat once per `apiKey` and `logLevel`.

## PlutusError shape

```typescript
interface PlutusError {
  code: PlutusErrorCode;
  message: string;
  cause?: unknown;
}

type PlutusErrorCode =
  | "INIT_FAILED"
  | "CUSTOMER_INFO_FAILED"
  | "PURCHASE_FAILED"
  | "OFFERINGS_FAILED"
  | "TRIAL_ELIGIBILITY_FAILED"
  | "RESTORE_FAILED";
```

## Available hooks (require PlutusProvider ancestor)

| Hook                 | Purpose                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `usePlutus()`        | Core state: isPro, isInTrial, isReady, isCustomerInfoLoaded, expirationDate, initError, purchasePackage |
| `useOfferings()`     | Load offerings with trial eligibility, discount calc, error and refetch                                 |
| `usePaywall()`       | Purchase flow orchestration for main paywall                                                            |
| `useRescuePaywall()` | Purchase flow for rescue/discount offers                                                                |

## Minimal setup

```tsx
<PlutusProvider apiKey={process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? ""} entitlementName="pro">
  <App />
</PlutusProvider>
```

## Full setup

```tsx
<PlutusProvider
  apiKey={process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? ""}
  entitlementName="pro"
  logLevel={LOG_LEVEL.DEBUG}
  offerings={{ default: "default", rescue: "rescue" }}
  callbacks={{
    onError: (error) => console.warn("[Plutus]", error.code, error.cause),
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
