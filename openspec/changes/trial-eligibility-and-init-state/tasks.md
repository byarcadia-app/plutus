## 1. Provider

- [ ] 1.1 Configure once per `apiKey` / `logLevel`; read callbacks and `entitlementName` through a ref;
      stable `onTrackEvent` / `onError` in the context
- [ ] 1.2 Request customer info after configuring; expose `isCustomerInfoLoaded`, `expirationDate`,
      `initError`; add `expirationDate` to `onCustomerInfoUpdated`'s state; add `CUSTOMER_INFO_FAILED`
- [ ] 1.3 `purchasePackage` resolves `false` on a store error, `undefined` only on a cancel

## 2. Hooks

- [ ] 2.1 `usePaywall` / `useRescuePaywall`: a cancel tracks `paywall_purchase_cancelled` and calls no
      failure callback
- [ ] 2.2 `useOfferings`: `isLoading` starts `true`, `initError` ends it; add `error` and `refetch()`;
      drop a stale response
- [ ] 2.3 `useOfferings`: trial from a free intro price and ELIGIBLE on iOS; add
      `TRIAL_ELIGIBILITY_FAILED`

## 3. Docs, example, release

- [ ] 3.1 JSDoc with `@example` on the public API; `docs/`, `README.md`, `skills/plutus-setup/`
- [ ] 3.2 Example app shows the new fields, the offerings error with a retry, and a dev log level
- [ ] 3.3 Changeset (minor) listing every behaviour change
- [ ] 3.4 Archive this change and sync `openspec/specs/`
