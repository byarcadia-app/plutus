# Hooks

All hooks must be used within a [PlutusProvider](./provider.md).

---

### usePlutus

Core hook — access subscription state and purchase functions.

```tsx
import { usePlutus } from "@byarcadia-app/plutus";

const {
  isPro,
  isInTrial,
  isReady,
  isCustomerInfoLoaded,
  expirationDate,
  initError,
  managementURL,
  purchasePackage,
  restorePurchases,
  translations,
} = usePlutus();
```

`isReady` turns `true` once the SDK is configured; `isCustomerInfoLoaded` turns `true` once the
person's customer info has arrived, so `isPro` is known. Gate a "you're Pro" screen on the second,
but do not block the whole UI on it: offline on a fresh install it waits for the SDK to report.

#### Returns

| Property               | Type                                                        | Description                                                                                        |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `isPro`                | `boolean`                                                   | Whether the user has the active entitlement                                                        |
| `isInTrial`            | `boolean`                                                   | Whether the user is in a trial period                                                              |
| `isReady`              | `boolean`                                                   | Whether the RevenueCat SDK is configured                                                           |
| `isCustomerInfoLoaded` | `boolean`                                                   | Whether customer info has arrived, so `isPro` and `isInTrial` are known                            |
| `expirationDate`       | `string \| null`                                            | When the entitlement ends (ISO 8601) — a trial's last day while in a trial; `null` without one     |
| `initError`            | `PlutusError \| null`                                       | The `INIT_FAILED` error when the SDK could not start                                               |
| `managementURL`        | `string \| null`                                            | URL to the platform's subscription management page                                                 |
| `purchasePackage`      | `(pack: PurchasesPackage) => Promise<boolean \| undefined>` | Purchase a package. `true` on success, `false` on a failure, `undefined` when the person cancelled |
| `restorePurchases`     | `() => Promise<boolean>`                                    | Restore previous purchases. Returns `true` if entitlement found                                    |
| `translations`         | `PlutusTranslations`                                        | Merged translation strings                                                                         |

---

### useOfferings

Load RevenueCat offerings with trial eligibility and discount percentages.

```tsx
import { useOfferings } from "@byarcadia-app/plutus";

const {
  isLoading,
  error,
  refetch,
  monthlyOffer,
  annualOffer,
  rescueOffer,
  monthlyHasTrial,
  annualHasTrial,
  annualDiscountPercentage,
  rescueOffsetDiscountPercentage,
} = useOfferings();
```

A trial is reported only when this person can still get it. On iOS the hook asks the store about
every product with a free intro price and reports a trial for an ELIGIBLE answer only — UNKNOWN,
INELIGIBLE, a missing answer or a failed check (`TRIAL_ELIGIBILITY_FAILED`) mean no trial. Elsewhere
the SDK cannot tell, so a free intro price alone decides.

#### Options

| Option       | Type               | Default | Description                                          |
| ------------ | ------------------ | ------- | ---------------------------------------------------- |
| `refetchKey` | `string \| number` | —       | Change this value to trigger a re-fetch of offerings |

#### Returns

| Property                         | Type                            | Description                                                                                                           |
| -------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `isLoading`                      | `boolean`                       | `true` from the first render until offerings and trial eligibility arrive; `false` at once if the SDK failed to start |
| `error`                          | `PlutusError \| null`           | `OFFERINGS_FAILED`, or the provider's `initError`                                                                     |
| `refetch`                        | `() => void`                    | Fetch the offerings again, e.g. from a retry button                                                                   |
| `monthlyOffer`                   | `PurchasesPackage \| undefined` | Monthly package from the default offering                                                                             |
| `annualOffer`                    | `PurchasesPackage \| undefined` | Annual package from the default offering                                                                              |
| `rescueOffer`                    | `PurchasesPackage \| undefined` | Annual package from the rescue offering                                                                               |
| `monthlyHasTrial`                | `boolean`                       | Whether this person can get the monthly package's free trial                                                          |
| `annualHasTrial`                 | `boolean`                       | Whether this person can get the annual package's free trial                                                           |
| `annualDiscountPercentage`       | `number \| undefined`           | Percentage saved choosing annual over monthly (floored)                                                               |
| `rescueOffsetDiscountPercentage` | `number \| undefined`           | Percentage saved choosing rescue over annual (floored)                                                                |

---

### usePaywall

Purchase flow orchestration for the main paywall — manages subscription type selection, purchase/restore actions, and analytics events. Events go to the provider's `onTrackEvent`; a cancelled purchase is tracked as `paywall_purchase_cancelled` and is not a failure.

```tsx
import { usePaywall } from "@byarcadia-app/plutus";

const {
  subscriptionType,
  isPurchasing,
  handleSubscriptionTypeChange,
  handlePurchasePackage,
  handleRestorePurchases,
  handleClosePress,
  handleTermsPress,
  handlePrivacyPress,
} = usePaywall({
  monthlyOffer,
  annualOffer,
  onPurchaseSuccess: (type) => router.back(),
  termsUrl: "https://example.com/terms",
  privacyUrl: "https://example.com/privacy",
});
```

#### Options

| Option              | Type                                    | Default | Description                                  |
| ------------------- | --------------------------------------- | ------- | -------------------------------------------- |
| `monthlyOffer`      | `PurchasesPackage \| undefined`         | —       | Monthly package to purchase                  |
| `annualOffer`       | `PurchasesPackage \| undefined`         | —       | Annual package to purchase                   |
| `onClose`           | `() => void`                            | —       | Called when the close button is pressed      |
| `onPurchaseSuccess` | `(type: "monthly" \| "annual") => void` | —       | Called after a successful purchase           |
| `onPurchaseFailed`  | `() => void`                            | —       | Called after a failed purchase, not a cancel |
| `onRestoreSuccess`  | `() => void`                            | —       | Called after successful restore              |
| `onRestoreFailed`   | `() => void`                            | —       | Called after failed restore                  |
| `termsUrl`          | `string`                                | —       | Terms of Service URL (opened via `Linking`)  |
| `privacyUrl`        | `string`                                | —       | Privacy Policy URL (opened via `Linking`)    |

#### Returns

| Property                       | Type                                    | Description                                                |
| ------------------------------ | --------------------------------------- | ---------------------------------------------------------- |
| `subscriptionType`             | `"monthly" \| "annual"`                 | Currently selected subscription type (default: `"annual"`) |
| `isPurchasing`                 | `boolean`                               | Whether a purchase or restore is in progress               |
| `handleSubscriptionTypeChange` | `(type: "monthly" \| "annual") => void` | Switch between monthly and annual                          |
| `handlePurchasePackage`        | `() => Promise<void>`                   | Initiate purchase of the selected package                  |
| `handleRestorePurchases`       | `() => Promise<void>`                   | Initiate restore purchases                                 |
| `handleClosePress`             | `() => void`                            | Handle close button press                                  |
| `handleTermsPress`             | `() => void`                            | Open terms URL                                             |
| `handlePrivacyPress`           | `() => void`                            | Open privacy URL                                           |

---

### useRescuePaywall

Purchase flow for rescue/discount offers — similar to usePaywall but for a single rescue package. A cancelled purchase is tracked as `paywall_purchase_cancelled` and is not a failure.

```tsx
import { useRescuePaywall } from "@byarcadia-app/plutus";

const {
  isPurchasing,
  handlePurchasePackage,
  handleRestorePurchases,
  handleClosePress,
  handleTermsPress,
  handlePrivacyPress,
} = useRescuePaywall({
  rescueOffer,
  onPurchaseSuccess: () => router.back(),
  termsUrl: "https://example.com/terms",
  privacyUrl: "https://example.com/privacy",
});
```

#### Options

| Option              | Type                            | Default | Description                                  |
| ------------------- | ------------------------------- | ------- | -------------------------------------------- |
| `rescueOffer`       | `PurchasesPackage \| undefined` | —       | Rescue package to purchase                   |
| `onClose`           | `() => void`                    | —       | Called when the close button is pressed      |
| `onPurchaseSuccess` | `() => void`                    | —       | Called after a successful purchase           |
| `onPurchaseFailed`  | `() => void`                    | —       | Called after a failed purchase, not a cancel |
| `onRestoreSuccess`  | `() => void`                    | —       | Called after successful restore              |
| `onRestoreFailed`   | `() => void`                    | —       | Called after failed restore                  |
| `termsUrl`          | `string`                        | —       | Terms of Service URL (opened via `Linking`)  |
| `privacyUrl`        | `string`                        | —       | Privacy Policy URL (opened via `Linking`)    |

#### Returns

| Property                 | Type                  | Description                                  |
| ------------------------ | --------------------- | -------------------------------------------- |
| `isPurchasing`           | `boolean`             | Whether a purchase or restore is in progress |
| `handlePurchasePackage`  | `() => Promise<void>` | Initiate purchase of the rescue package      |
| `handleRestorePurchases` | `() => Promise<void>` | Initiate restore purchases                   |
| `handleClosePress`       | `() => void`          | Handle close button press                    |
| `handleTermsPress`       | `() => void`          | Open terms URL                               |
| `handlePrivacyPress`     | `() => void`          | Open privacy URL                             |
