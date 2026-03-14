## 1. Documentation Structure

- [x] 1.1 Create `docs/README.md` — index with Guides and API Reference sections linking to all doc pages
- [x] 1.2 Create `docs/_template.md` — contributor template with conventions, props table format, hook and provider templates

## 2. Guide Pages

- [x] 2.1 Create `docs/installation.md` — install command, peer dependencies, quick start example

## 3. API Reference Pages

- [x] 3.1 Create `docs/provider.md` — PlutusProvider props table, usage example, callbacks reference
- [x] 3.2 Create `docs/hooks.md` — usePlutus, useOfferings, usePaywall, useRescuePaywall with options, returns, examples
- [x] 3.3 Create `docs/errors.md` — PlutusError type, error codes, `errors` namespace factories, usage examples
- [x] 3.4 Create `docs/translations.md` — PlutusTranslations type, defaults, override example

## 4. README Restyle

- [x] 4.1 Rewrite `README.md` to match aether's style — centered title, badges, brief features with doc links, Documentation section, requirements, license

## 5. Validation

- [x] 5.1 Verify all relative links between docs files resolve correctly
- [x] 5.2 Run `pnpm check && pnpm lint && pnpm fmt:check && pnpm build` to ensure no regressions
