## 1. Error System

- [x] 1.1 Create `src/errors.ts` with `PlutusError` class and factory methods (`initFailed`, `purchaseFailed`, `offeringsFailed`, `restoreFailed`)
- [x] 1.2 Remove `PlutusError` interface and `PlutusErrorCode` type from `src/types.ts`, re-export `PlutusErrorCode` from errors if needed
- [x] 1.3 Update `plutus-provider.tsx` to use `PlutusError.initFailed()`, `PlutusError.purchaseFailed()`, `PlutusError.restoreFailed()`
- [x] 1.4 Update `use-offerings.ts` to use `PlutusError.offeringsFailed()`
- [x] 1.5 Update `onError` callback type from `(error: PlutusError) => void` to `(error: PlutusError) => void` (class reference)

## 2. Simplify Config & Types

- [x] 2.1 Change `apiKey` in config to `string` (remove platform object form)
- [x] 2.2 Inline `PlutusCallbacks` and `PlutusOfferingsConfig` into `PlutusConfig` interface
- [x] 2.3 Remove `PlutusContextValue` export — keep it in provider file only
- [x] 2.4 Simplify provider `apiKey` resolution — remove Platform branching, pass directly to `Purchases.configure`

## 3. Co-locate Hook Types

- [x] 3.1 Move `UsePaywallOptions` and `BasePaywallCallbacks` inline into `use-paywall.ts` — remove `onTrackEvent` from options
- [x] 3.2 Move `UseRescuePaywallOptions` inline into `use-rescue-paywall.ts` — remove `onTrackEvent` from options
- [x] 3.3 Remove `trackEvent` fallback logic from both hooks — use `onTrackEvent` from `usePlutus()` directly
- [x] 3.4 Remove `onTrackEvent` from `PlutusContextValue` if it's only used internally (keep in context but don't expose in value type)

## 4. Clean Up Barrel Exports

- [x] 4.1 Update `src/index.ts` — export only `PlutusConfig`, `PlutusError`, `PlutusErrorCode`, `PlutusTranslations`
- [x] 4.2 Verify build succeeds (`pnpm build`)
