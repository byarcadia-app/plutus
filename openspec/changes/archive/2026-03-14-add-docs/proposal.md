## Why

Plutus lacks structured documentation beyond the README. The sibling package `@byarcadia-app/aether` already ships a `docs/` directory with installation guides, API reference pages, and a contributor template. Aligning Plutus to the same documentation style creates a consistent developer experience across the monorepo and makes onboarding easier.

## What Changes

- Create `docs/` directory with documentation files matching aether's structure:
  - `docs/README.md` — documentation index (guides + API reference links)
  - `docs/_template.md` — contributor template for writing hook/provider docs
  - `docs/installation.md` — installation & quick start guide
  - `docs/provider.md` — PlutusProvider configuration reference
  - `docs/hooks.md` — useOfferings, usePaywall, useRescuePaywall reference
  - `docs/errors.md` — PlutusError types and error factory reference
  - `docs/translations.md` — translation system and overrides
- Rewrite `README.md` to match aether's style: brief feature list with doc links, documentation section, requirements, license

## Capabilities

### New Capabilities

- `docs-structure`: Documentation directory with index, template, installation, provider, hooks, errors, and translations pages — following aether's conventions

### Modified Capabilities

<!-- No existing specs are affected -->

## Impact

- New `docs/` directory (7 files)
- Modified `README.md` (restyled, links to docs)
- No code changes, no API changes, no dependency changes
