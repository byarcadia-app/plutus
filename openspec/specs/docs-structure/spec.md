## ADDED Requirements

### Requirement: Documentation index

The `docs/README.md` file SHALL provide an index of all documentation pages, organized into Guides (installation) and API Reference (provider, hooks, errors, translations) sections with relative links.

#### Scenario: Developer opens docs index

- **WHEN** a developer opens `docs/README.md`
- **THEN** they see a brief intro and links to all documentation pages grouped by category

### Requirement: Contributor template

The `docs/_template.md` file SHALL define the conventions and structure for writing Plutus documentation, including import path format, props table format, and templates for hooks and the provider.

#### Scenario: Contributor adds docs for a new hook

- **WHEN** a contributor creates documentation for a new hook
- **THEN** they can follow `docs/_template.md` to produce a consistently formatted page with import, usage examples, and API reference table

### Requirement: Installation guide

The `docs/installation.md` file SHALL document the installation command, peer dependency setup, and a quick start example showing PlutusProvider wrapping an app.

#### Scenario: New user installs plutus

- **WHEN** a developer reads `docs/installation.md`
- **THEN** they find the pnpm install command, peer dependency note, and a working quick start code example

### Requirement: Provider documentation

The `docs/provider.md` file SHALL document PlutusProvider's props (apiKey, entitlementName, logLevel, offerings, callbacks, translations) with types, defaults, and a usage example.

#### Scenario: Developer configures PlutusProvider

- **WHEN** a developer reads `docs/provider.md`
- **THEN** they find a props table with all PlutusProvider props, their types, defaults, and descriptions, plus a usage example

### Requirement: Hooks documentation

The `docs/hooks.md` file SHALL document usePlutus, useOfferings, usePaywall, and useRescuePaywall with their options, return values, and usage examples.

#### Scenario: Developer uses usePaywall

- **WHEN** a developer reads `docs/hooks.md`
- **THEN** they find the hook's options interface, return type, and a code example for each hook

### Requirement: Errors documentation

The `docs/errors.md` file SHALL document the PlutusError type, all PlutusErrorCode values, and the `errors` namespace factory functions with usage examples.

#### Scenario: Developer handles purchase errors

- **WHEN** a developer reads `docs/errors.md`
- **THEN** they find the error type definition, all error codes, and how to use the error factories in callbacks

### Requirement: Translations documentation

The `docs/translations.md` file SHALL document the PlutusTranslations type, default English strings, and how to provide partial overrides via the `translations` prop.

#### Scenario: Developer customizes error messages

- **WHEN** a developer reads `docs/translations.md`
- **THEN** they find the full translation keys with defaults and an example of overriding specific strings

### Requirement: README restyling

The root `README.md` SHALL be restyled to match aether's format: centered title with badges, brief feature list with doc links, Documentation section linking to all `docs/` pages, requirements table, and license.

#### Scenario: Developer views README on npm/GitHub

- **WHEN** a developer views the root `README.md`
- **THEN** they see a concise overview with links to detailed documentation in `docs/`
