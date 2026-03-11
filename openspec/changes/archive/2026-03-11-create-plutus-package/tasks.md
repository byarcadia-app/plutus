## 1. Package Scaffolding

- [x] 1.1 Create `package.json` with name `@byarcadia-app/plutus`, peer dependencies (`react`, `react-native`, `react-native-purchases`), dev dependencies, build scripts, and export configuration matching aether conventions (dual CJS/ESM, types)
- [x] 1.2 Create `tsconfig.json` targeting ES2022, module ESNext, bundler resolution, strict mode, react-jsx
- [x] 1.3 Create `tsup.config.ts` with single entry point `src/index.ts`, CJS + ESM output, `react-native-purchases` as external, source maps, tree-shaking
- [x] 1.4 Create `src/index.ts` barrel export file

## 2. Types and Configuration

- [x] 2.1 Create `src/types.ts` with `PlutusConfig` interface: `apiKey` (string | `{ apple?: string; google?: string }`), `entitlementName` (string), optional `logLevel` (LOG_LEVEL), `offerings` (`{ default?: string; rescue?: string }`), `callbacks` (`{ onError?, onCustomerInfoUpdated?, onTrackEvent? }`), `translations` (`Partial<PlutusTranslations>`)
- [x] 2.2 Define `PlutusTranslations` type with all consumer-facing string keys and English defaults in `src/translations.ts`
- [x] 2.3 Define `PlutusError` structured error type with `code` (union: `"INIT_FAILED"` | `"PURCHASE_FAILED"` | `"OFFERINGS_FAILED"` | `"RESTORE_FAILED"`), `originalError`, and optional `package` context
- [x] 2.4 Define paywall hook option types (`UsePaywallOptions`, `UseRescuePaywallOptions`) with all callback signatures including per-hook `onTrackEvent` override

## 3. Provider and Initialization

- [x] 3.1 Create `src/provider/plutus-provider.tsx` — `PlutusProvider` component that accepts `PlutusConfig`, initializes RevenueCat SDK with platform-specific API key selection, sets log level, merges translations with English defaults, and manages `isReady` state
- [x] 3.2 Implement customer info update listener in the provider — register on mount, remove on unmount, evaluate entitlement against `entitlementName`, update `isPro`/`isInTrial`/`managementURL` state, call `callbacks.onCustomerInfoUpdated`
- [x] 3.3 Implement `purchasePackage` function in provider — purchase via SDK, update entitlement state on success, handle cancellation silently, call `callbacks.onError` with structured `PlutusError` on non-cancellation errors
- [x] 3.4 Implement `restorePurchases` function in provider — restore via SDK, return boolean based on entitlement check
- [x] 3.5 Create `src/provider/use-plutus.ts` — context consumer hook with provider boundary check (throw if used outside provider), exposes state, actions, resolved translations, and provider-level `onTrackEvent`

## 4. Offerings Hook

- [x] 4.1 Create `src/hooks/use-offerings.ts` — hook that loads offerings when provider is ready, uses provider's `offerings.default` and `offerings.rescue` identifiers, accepts optional `refetchKey`, exposes `monthlyOffer`, `annualOffer`, `rescueOffer`, `isLoading`
- [x] 4.2 Implement per-package trial detection — expose `monthlyHasTrial` and `annualHasTrial` booleans derived from `product.introPrice !== null && introPrice.price === 0`
- [x] 4.3 Implement discount calculation utilities — `calculateAnnualDiscount` and `calculateRescueOffsetDiscount` returning floored percentage or undefined
- [x] 4.4 Expose computed `annualDiscountPercentage` and `rescueOffsetDiscountPercentage` from the hook

## 5. Paywall Hooks

- [x] 5.1 Create `src/hooks/use-paywall.ts` — hook accepting offers and `UsePaywallOptions` (callbacks + `termsUrl` + `privacyUrl`), managing `subscriptionType` and `isPurchasing` state, with `onTrackEvent` falling back to provider-level callback
- [x] 5.2 Implement `handlePurchasePackage`, `handleRestorePurchases`, `handleSubscriptionTypeChange`, `handleClosePress`, `handleTermsPress`, `handlePrivacyPress` in `usePaywall`
- [x] 5.3 Create `src/hooks/use-rescue-paywall.ts` — hook accepting rescue offer and `UseRescuePaywallOptions`, managing `isPurchasing` state, with same handler pattern and `onTrackEvent` fallback

## 6. Barrel Exports and Build

- [x] 6.1 Wire up all exports in `src/index.ts` — provider, hooks, types (PlutusConfig, PlutusProvider, usePlutus, useOfferings, usePaywall, useRescuePaywall, PlutusTranslations, PlutusError, all option/config types)
- [x] 6.2 Run `tsup` build and verify output — CJS, ESM, and `.d.ts` files generated correctly
- [x] 6.3 Verify type exports are complete and no internal types leak
