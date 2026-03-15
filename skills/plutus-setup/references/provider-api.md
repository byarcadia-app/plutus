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

| Callback                | Type                                                                          | Description                                                |
| ----------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `onError`               | `(error: PlutusError) => void`                                                | Called on SDK errors (init, purchase, offerings, restore). |
| `onCustomerInfoUpdated` | `(info: CustomerInfo, state: { isPro: boolean; isInTrial: boolean }) => void` | Called when RevenueCat customer info changes.              |
| `onTrackEvent`          | `(name: string, params?: Record<string, unknown>) => void`                    | Analytics event callback — used as fallback by all hooks.  |

## Callback hierarchy

Hooks accept their own `onTrackEvent` callback. When provided, the hook-level callback takes precedence over the provider-level `onTrackEvent`. This lets you customize analytics per-screen while keeping a global fallback.

## PlutusError shape

```typescript
interface PlutusError {
  code: PlutusErrorCode;
  message: string;
  cause?: Error;
}

type PlutusErrorCode = "INIT_FAILED" | "OFFERINGS_FAILED" | "PURCHASE_FAILED" | "RESTORE_FAILED";
```

## Available hooks (require PlutusProvider ancestor)

| Hook                 | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `usePlutus()`        | Core state: isPro, isInTrial, isReady, purchasePackage |
| `useOfferings()`     | Load offerings with trial detection and discount calc  |
| `usePaywall()`       | Purchase flow orchestration for main paywall           |
| `useRescuePaywall()` | Purchase flow for rescue/discount offers               |

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
