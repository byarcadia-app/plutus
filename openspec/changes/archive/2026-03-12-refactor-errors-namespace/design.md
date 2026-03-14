## Context

Current `PlutusError` is a class with static factory methods. This is overengineered — plutus wraps RevenueCat SDK errors, where the original error already has its own stack trace in `cause`. No need for a class.

## Goals / Non-Goals

**Goals:**

- Drop the class entirely — plain objects + interface
- Ergonomic namespace API: `errors.INIT_FAILED(cause)`
- Consistent with factory-function error patterns in other byarcadia packages

**Non-Goals:**

- Changing error codes or error behavior
- Adding error processing/diagnosis

## Decisions

### Plain objects + errors namespace (no class)

```ts
export interface PlutusError {
  readonly code: PlutusErrorCode;
  readonly message: string;
  readonly cause?: unknown;
  readonly package?: PurchasesPackage;
}

export const errors = {
  INIT_FAILED: (cause: unknown): PlutusError => ({
    code: "INIT_FAILED",
    message: "Initialization failed",
    cause,
  }),
  PURCHASE_FAILED: (cause: unknown, pack?: PurchasesPackage): PlutusError => ({
    code: "PURCHASE_FAILED",
    message: "Purchase failed",
    cause,
    package: pack,
  }),
  OFFERINGS_FAILED: (cause: unknown): PlutusError => ({
    code: "OFFERINGS_FAILED",
    message: "Failed to load offerings",
    cause,
  }),
  RESTORE_FAILED: (cause: unknown): PlutusError => ({
    code: "RESTORE_FAILED",
    message: "Restore purchases failed",
    cause,
  }),
};
```

Why no class:

- These are SDK wrapper errors, not application exceptions
- The original RevenueCat error (in `cause`) already has stack traces
- A PlutusError stack trace just points to plutus internals — useless to the consumer
- Consumer identifies errors by `error.code`, not `instanceof`

## Risks / Trade-offs

- No `instanceof Error` — not needed. Consumer gets `PlutusError` typed via `onError` callback, checks `error.code`.
