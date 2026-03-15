<h1 align="center">@byarcadia-app/plutus</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@byarcadia-app/plutus"><img src="https://img.shields.io/npm/v/@byarcadia-app/plutus?style=flat" alt="npm version" /></a>&nbsp;<a href="https://github.com/byarcadia-app/plutus/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@byarcadia-app/plutus?style=flat" alt="License" /></a>&nbsp;<img src="https://img.shields.io/badge/platform-iOS-black?style=flat" alt="iOS only" />&nbsp;<img src="https://img.shields.io/badge/status-alpha-orange?style=flat" alt="Alpha" />
</p>

<p align="center">
  Reusable <a href="https://www.revenuecat.com/">RevenueCat</a> wrapper for <a href="https://reactnative.dev/">React Native</a> in-app purchases — configurable, callback-driven, zero app-specific dependencies.
</p>

Named after the Greek god of wealth — Plutus wraps RevenueCat so you can set up in-app purchases once and reuse across projects.

## What it does

- **[PlutusProvider](docs/provider.md)** — RevenueCat SDK initialization, customer info listener, entitlement state management
- **[usePlutus](docs/hooks.md#useplutus)** — Access `isPro`, `isInTrial`, `isReady`, `managementURL`, `purchasePackage`, `restorePurchases`
- **[useOfferings](docs/hooks.md#useofferings)** — Load offerings with configurable identifiers, per-package trial detection, computed discount percentages
- **[usePaywall](docs/hooks.md#usepaywall)** — Purchase flow orchestration with subscription type selection, configurable callbacks
- **[useRescuePaywall](docs/hooks.md#userescuepaywall)** — Rescue/discount offer purchase flow
- **[Translations](docs/translations.md)** — English fallback strings, override with `Partial<PlutusTranslations>`
- **[Error handling](docs/errors.md)** — Typed error objects with error codes and factory functions
- **Callback-driven** — All app-specific concerns (analytics, alerts, navigation, haptics) via callbacks, not baked in

## Documentation

- [Installation & Quick Start](docs/installation.md)
- [Payment Setup (iOS)](docs/payment-setup.md)
- [PlutusProvider](docs/provider.md)
- [Hooks](docs/hooks.md)
- [Errors](docs/errors.md)
- [Translations](docs/translations.md)

## Agent Skill

Set up Plutus in your project with a single command using [skills.sh](https://skills.sh):

```bash
npx skills add byarcadia-app/plutus --skill plutus-setup
```

The skill handles dependency installation, PlutusProvider integration, and environment variable configuration. See [`skills/plutus-setup/`](skills/plutus-setup/) for details.

## Example App

A complete working integration lives in `example/`. It demonstrates provider setup and all hook usage patterns.

```bash
pnpm example:start    # Start Expo dev server
pnpm example:ios      # Run on iOS simulator
```

## Requirements

| Dependency             | Version |
| ---------------------- | ------- |
| React                  | >= 18   |
| React Native           | >= 0.72 |
| react-native-purchases | >= 9    |

## License

MIT
