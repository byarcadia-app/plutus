# Translations

Plutus ships with English default strings. Override any subset via the `translations` prop on [PlutusProvider](./provider.md).

## Import

```tsx
import type { PlutusTranslations } from "@byarcadia-app/plutus";
```

## PlutusTranslations

```ts
type PlutusTranslations = {
  purchaseError: {
    title: string;
    message: string;
  };
  restoreError: {
    title: string;
    message: string;
  };
};
```

## Default Values

| Key                     | Default                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `purchaseError.title`   | `"Purchase Error"`                                                  |
| `purchaseError.message` | `"There was a problem processing your purchase. Please try again."` |
| `restoreError.title`    | `"Restore Error"`                                                   |
| `restoreError.message`  | `"There was a problem restoring your purchases. Please try again."` |

## Overriding

Pass a `Partial<PlutusTranslations>` — only the keys you provide are replaced, the rest fall back to defaults:

```tsx
<PlutusProvider
  apiKey="..."
  entitlementName="Pro"
  translations={{
    purchaseError: {
      title: "Oops!",
      message: "We couldn't complete your purchase. Please try again.",
    },
  }}
>
```

Nested merging is supported — you can override just `purchaseError.title` without touching `purchaseError.message`:

```tsx
translations={{
  purchaseError: { title: "Payment Failed" },
}}
```

Access translations in your components via `usePlutus()`:

```tsx
const { translations } = usePlutus();

Alert.alert(translations.purchaseError.title, translations.purchaseError.message);
```
