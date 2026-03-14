# Errors

Plutus uses plain error objects instead of thrown exceptions. All errors are delivered through callbacks.

## Import

```tsx
import { errors, type PlutusError, type PlutusErrorCode } from "@byarcadia-app/plutus";
```

## PlutusError

```ts
interface PlutusError {
  readonly code: PlutusErrorCode;
  readonly message: string;
  readonly cause?: unknown;
  readonly package?: PurchasesPackage;
}
```

| Property  | Type                            | Description                                         |
| --------- | ------------------------------- | --------------------------------------------------- |
| `code`    | `PlutusErrorCode`               | Machine-readable error code                         |
| `message` | `string`                        | Human-readable error description                    |
| `cause`   | `unknown`                       | Original error from RevenueCat SDK                  |
| `package` | `PurchasesPackage \| undefined` | The package that failed (only on `PURCHASE_FAILED`) |

## Error Codes

| Code               | When                                        |
| ------------------ | ------------------------------------------- |
| `INIT_FAILED`      | RevenueCat SDK initialization fails         |
| `PURCHASE_FAILED`  | A package purchase fails (not cancellation) |
| `OFFERINGS_FAILED` | Loading offerings fails                     |
| `RESTORE_FAILED`   | Restoring purchases fails                   |

## Factory Functions

The `errors` namespace provides factory functions for creating error objects:

```tsx
import { errors } from "@byarcadia-app/plutus";

errors.INIT_FAILED(cause);
// → { code: "INIT_FAILED", message: "Initialization failed", cause }

errors.PURCHASE_FAILED(cause, pack);
// → { code: "PURCHASE_FAILED", message: "Purchase failed", cause, package: pack }

errors.OFFERINGS_FAILED(cause);
// → { code: "OFFERINGS_FAILED", message: "Failed to load offerings", cause }

errors.RESTORE_FAILED(cause);
// → { code: "RESTORE_FAILED", message: "Restore purchases failed", cause }
```

## Usage

Handle errors via the provider's `onError` callback:

```tsx
<PlutusProvider
  apiKey="..."
  entitlementName="Pro"
  callbacks={{
    onError: (error) => {
      switch (error.code) {
        case "INIT_FAILED":
          crashlytics.recordError(error.cause);
          break;
        case "PURCHASE_FAILED":
          Alert.alert(translations.purchaseError.title, translations.purchaseError.message);
          break;
        case "RESTORE_FAILED":
          Alert.alert(translations.restoreError.title, translations.restoreError.message);
          break;
      }
    },
  }}
>
```
