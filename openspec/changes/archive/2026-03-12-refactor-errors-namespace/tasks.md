## 1. Rewrite Error Module

- [x] 1.1 Rewrite `src/errors.ts` — make class internal, export `errors` namespace object with factory functions, export `PlutusError` as type only

## 2. Update Call Sites

- [x] 2.1 Update `plutus-provider.tsx` — `PlutusError.initFailed()` → `errors.INIT_FAILED()`, `PlutusError.purchaseFailed()` → `errors.PURCHASE_FAILED()`, `PlutusError.restoreFailed()` → `errors.RESTORE_FAILED()`
- [x] 2.2 Update `use-offerings.ts` — `PlutusError.offeringsFailed()` → `errors.OFFERINGS_FAILED()`

## 3. Update Exports

- [x] 3.1 Update `src/index.ts` — export `errors` (value) and `PlutusError` (type only) from errors module
- [x] 3.2 Verify build succeeds
