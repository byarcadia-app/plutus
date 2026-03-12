## Why

The initial implementation over-engineered several areas: error handling uses untyped plain objects, types are scattered in a central file instead of co-located, API key config supports Android (not needed — iOS only), and hook-level `onTrackEvent` override creates two sources of truth. This change simplifies the API surface before any consumers adopt it.

## What Changes

- **BREAKING** Replace plain `PlutusError` object with a `PlutusError` class with factory methods (`PlutusError.initFailed(cause)`, etc.) — typed, instanceof-checkable
- **BREAKING** `apiKey` becomes `string` (drop `{ apple?: string; google?: string }` object form)
- **BREAKING** Remove `onTrackEvent` from hook options (`UsePaywallOptions`, `UseRescuePaywallOptions`) — only provider-level `onTrackEvent` remains
- Remove `PlutusContextValue`, `UsePaywallOptions`, `UseRescuePaywallOptions`, `BasePaywallCallbacks` from shared `types.ts` — co-locate with usage or inline
- Remove unnecessary type exports from barrel (`index.ts`)
- Keep translation merge as-is (manual spread is fine for 2-level, 2-key object)

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `provider-and-init`: apiKey becomes string-only (iOS), error handling uses PlutusError class
- `purchase-flow`: errors use PlutusError class factories
- `paywall-hooks`: remove hook-level onTrackEvent override, co-locate hook option types
- `offerings`: errors use PlutusError class factories

## Impact

- `src/errors.ts` — new file (PlutusError class + factories)
- `src/types.ts` — significantly simplified (remove hook types, simplify config)
- `src/provider/plutus-provider.tsx` — simplified apiKey resolution, use PlutusError factories
- `src/hooks/use-paywall.ts` — remove trackEvent fallback, inline options type
- `src/hooks/use-rescue-paywall.ts` — same
- `src/hooks/use-offerings.ts` — use PlutusError factory
- `src/index.ts` — reduce type exports
