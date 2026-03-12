## Why

The `PlutusError` class with static factory methods works, but doesn't match the error pattern used across other byarcadia packages. Those use a namespace object (`errors.XXX()`) with an internal (non-exported) class. Aligning plutus with the same pattern keeps the codebase consistent.

## What Changes

- **BREAKING** Replace `PlutusError` class (with static methods) with:
  - Internal `PlutusError` class (not exported as value)
  - Exported `errors` namespace object with factory functions: `errors.INIT_FAILED(cause)`, `errors.PURCHASE_FAILED(cause, pack)`, `errors.OFFERINGS_FAILED(cause)`, `errors.RESTORE_FAILED(cause)`
  - Export `PlutusError` as a type only (for consumer `onError` callback typing)
- Update all internal call sites from `PlutusError.initFailed(cause)` → `errors.INIT_FAILED(cause)`
- Update barrel exports: remove `PlutusError` value export, add `errors` value export, keep `PlutusError` as type export

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `provider-and-init`: error creation uses `errors.INIT_FAILED()` pattern
- `purchase-flow`: error creation uses `errors.PURCHASE_FAILED()`, `errors.RESTORE_FAILED()`
- `offerings`: error creation uses `errors.OFFERINGS_FAILED()`

## Impact

- `src/errors.ts` — rewrite: internal class + exported namespace
- `src/provider/plutus-provider.tsx` — update error creation calls
- `src/hooks/use-offerings.ts` — update error creation call
- `src/index.ts` — update exports
- `src/types.ts` — `onError` callback type uses `PlutusError` (type-only, no change needed)
