## Context

Plutus has no consumers yet, so breaking changes are free. The current API has several areas of unnecessary complexity inherited from trying to be too general too early.

## Goals / Non-Goals

**Goals:**
- Simpler, more consistent error handling via a proper Error class
- Reduce exported types to only what consumers actually need
- Remove Android/platform branching (iOS-only target)
- Single source of truth for event tracking (provider only)

**Non-Goals:**
- Changing hook behavior or offerings logic
- Changing translation system (manual spread is fine)
- Adding new features

## Decisions

### 1. PlutusError as a class with factory methods

```ts
class PlutusError extends Error {
  readonly code: PlutusErrorCode;
  readonly cause?: unknown;
  readonly package?: PurchasesPackage;

  private constructor(code, message, opts?) { ... }

  static initFailed(cause: unknown) { ... }
  static purchaseFailed(cause: unknown, pack?: PurchasesPackage) { ... }
  static offeringsFailed(cause: unknown) { ... }
  static restoreFailed(cause: unknown) { ... }
}
```

Why class over plain objects:
- `instanceof` checks in consumer error handlers
- Stack traces via `Error` base
- Factory methods are self-documenting and enforce correct shape
- Consistent with the error pattern used in other byarcadia packages

Alternative: keep plain objects — rejected because they lack instanceof and stack traces.

### 2. apiKey: string (drop platform object)

Plutus targets iOS only. The `{ apple?: string; google?: string }` form adds branching for a platform we don't ship to. Just `apiKey: string`.

### 3. Remove hook-level onTrackEvent

Currently hooks accept `onTrackEvent` which overrides the provider's. This creates two sources — confusing. Provider-level `onTrackEvent` is sufficient. Hooks just call `onTrackEvent` from context.

This also removes `onTrackEvent` from `PlutusContextValue` (it doesn't need to be exposed — hooks get it internally via `usePlutus`).

### 4. Co-locate types, reduce exports

- `UsePaywallOptions` / `UseRescuePaywallOptions` / `BasePaywallCallbacks` → inline in their hook files
- `PlutusContextValue` → keep in provider file, don't export from barrel
- `PlutusCallbacks` / `PlutusOfferingsConfig` → inline in `PlutusConfig`
- Export from barrel: `PlutusConfig`, `PlutusError`, `PlutusErrorCode`, `PlutusTranslations`

## Risks / Trade-offs

- [Removing Android support] → Not a risk today (iOS only). If Android is needed later, re-add `apiKey` platform object in a minor version.
- [Fewer exported types] → Consumers who relied on `UsePaywallOptions` etc. would need to adjust — but there are no consumers yet.
