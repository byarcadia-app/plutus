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
  managementURL,
  purchasePackage,
  restorePurchases,
  translations,
} = usePlutus();
```

#### Returns

| Property           | Type                                                        | Description                                                                  |
| ------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `isPro`            | `boolean`                                                   | Whether the user has the active entitlement                                  |
| `isInTrial`        | `boolean`                                                   | Whether the user is in a trial period                                        |
| `isReady`          | `boolean`                                                   | Whether the RevenueCat SDK has initialized                                   |
| `managementURL`    | `string \| null`                                            | URL to the platform's subscription management page                           |
| `purchasePackage`  | `(pack: PurchasesPackage) => Promise<boolean \| undefined>` | Purchase a package. Returns `true` on success, `undefined` on cancel/failure |
| `restorePurchases` | `() => Promise<boolean>`                                    | Restore previous purchases. Returns `true` if entitlement found              |
| `translations`     | `PlutusTranslations`                                        | Merged translation strings                                                   |

---

### useOfferings

Load RevenueCat offerings with computed trial detection and discount percentages.

```tsx
import { useOfferings } from "@byarcadia-app/plutus";

const {
  isLoading,
  monthlyOffer,
  annualOffer,
  rescueOffer,
  monthlyHasTrial,
  annualHasTrial,
  annualDiscountPercentage,
  rescueOffsetDiscountPercentage,
} = useOfferings();
```

#### Options

| Option       | Type               | Default | Description                                          |
| ------------ | ------------------ | ------- | ---------------------------------------------------- |
| `refetchKey` | `string \| number` | —       | Change this value to trigger a re-fetch of offerings |

#### Returns

| Property                         | Type                            | Description                                              |
| -------------------------------- | ------------------------------- | -------------------------------------------------------- |
| `isLoading`                      | `boolean`                       | Whether offerings are currently being fetched            |
| `monthlyOffer`                   | `PurchasesPackage \| undefined` | Monthly package from the default offering                |
| `annualOffer`                    | `PurchasesPackage \| undefined` | Annual package from the default offering                 |
| `rescueOffer`                    | `PurchasesPackage \| undefined` | Annual package from the rescue offering                  |
| `monthlyHasTrial`                | `boolean`                       | Whether the monthly package has a free trial intro price |
| `annualHasTrial`                 | `boolean`                       | Whether the annual package has a free trial intro price  |
| `annualDiscountPercentage`       | `number \| undefined`           | Percentage saved choosing annual over monthly (floored)  |
| `rescueOffsetDiscountPercentage` | `number \| undefined`           | Percentage saved choosing rescue over annual (floored)   |

---

### usePaywall

Purchase flow orchestration for the main paywall — manages subscription type selection, purchase/restore actions, and analytics events.

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
  onTrackEvent: (name, params) => analytics.track(name, params),
  termsUrl: "https://example.com/terms",
  privacyUrl: "https://example.com/privacy",
});
```

#### Options

| Option              | Type                                    | Default | Description                                 |
| ------------------- | --------------------------------------- | ------- | ------------------------------------------- |
| `monthlyOffer`      | `PurchasesPackage \| undefined`         | —       | Monthly package to purchase                 |
| `annualOffer`       | `PurchasesPackage \| undefined`         | —       | Annual package to purchase                  |
| `onClose`           | `() => void`                            | —       | Called when the close button is pressed     |
| `onPurchaseSuccess` | `(type: "monthly" \| "annual") => void` | —       | Called after a successful purchase          |
| `onPurchaseFailed`  | `() => void`                            | —       | Called after a failed purchase              |
| `onRestoreSuccess`  | `() => void`                            | —       | Called after successful restore             |
| `onRestoreFailed`   | `() => void`                            | —       | Called after failed restore                 |
| `termsUrl`          | `string`                                | —       | Terms of Service URL (opened via `Linking`) |
| `privacyUrl`        | `string`                                | —       | Privacy Policy URL (opened via `Linking`)   |

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

Purchase flow for rescue/discount offers — similar to usePaywall but for a single rescue package.

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

| Option              | Type                            | Default | Description                                 |
| ------------------- | ------------------------------- | ------- | ------------------------------------------- |
| `rescueOffer`       | `PurchasesPackage \| undefined` | —       | Rescue package to purchase                  |
| `onClose`           | `() => void`                    | —       | Called when the close button is pressed     |
| `onPurchaseSuccess` | `() => void`                    | —       | Called after a successful purchase          |
| `onPurchaseFailed`  | `() => void`                    | —       | Called after a failed purchase              |
| `onRestoreSuccess`  | `() => void`                    | —       | Called after successful restore             |
| `onRestoreFailed`   | `() => void`                    | —       | Called after failed restore                 |
| `termsUrl`          | `string`                        | —       | Terms of Service URL (opened via `Linking`) |
| `privacyUrl`        | `string`                        | —       | Privacy Policy URL (opened via `Linking`)   |

#### Returns

| Property                 | Type                  | Description                                  |
| ------------------------ | --------------------- | -------------------------------------------- |
| `isPurchasing`           | `boolean`             | Whether a purchase or restore is in progress |
| `handlePurchasePackage`  | `() => Promise<void>` | Initiate purchase of the rescue package      |
| `handleRestorePurchases` | `() => Promise<void>` | Initiate restore purchases                   |
| `handleClosePress`       | `() => void`          | Handle close button press                    |
| `handleTermsPress`       | `() => void`          | Open terms URL                               |
| `handlePrivacyPress`     | `() => void`          | Open privacy URL                             |
