# @byarcadia-app/plutus Documentation

> [!WARNING]
> **Deprecated.** `@byarcadia-app/plutus` is no longer maintained. Its successor is
> [`@byarcadia-app/payments`](https://github.com/byarcadia-app/foundation/tree/main/packages/payments) in [byarcadia-app/foundation](https://github.com/byarcadia-app/foundation),
> first released as [`@byarcadia-app/payments@0.2.0`](https://github.com/byarcadia-app/foundation/releases/tag/%40byarcadia-app%2Fpayments%400.2.0). It replaces
> `@byarcadia-app/plutus@0.2.0` and names each `Plutus*` export `Payments*`; its README covers the
> setup.

Documentation for the @byarcadia-app/plutus RevenueCat wrapper. Cross-cutting topics (installation, provider, hooks, errors, translations) live here in `docs/`.

## Guides

- [Installation & Quick Start](./installation.md) — Install, peer deps, provider setup
- [Payment Setup (iOS)](./payment-setup.md) — RevenueCat + App Store Connect configuration
- [PlutusProvider](./provider.md) — Root provider configuration and callbacks

## API Reference

- [Hooks](./hooks.md) — usePlutus, useOfferings, usePaywall, useRescuePaywall
- [Errors](./errors.md) — PlutusError type, error codes, factory functions
- [Translations](./translations.md) — Default strings and overrides
