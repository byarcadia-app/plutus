## 1. Create context7.json

- [x] 1.1 Create `context7.json` at project root with `$schema`, `projectTitle`, `description`, `folders`, `excludeFolders`, `excludeFiles`, and `rules` fields following the aether pattern
- [x] 1.2 Populate `rules` array with plutus-specific conventions: callback-driven architecture, PlutusError in error callbacks, hook creation pattern (`src/hooks/use-{name}.ts`), onTrackEvent fallback, and JSDoc with `@example` tag requirement

## 2. Verification

- [x] 2.1 Validate `context7.json` is valid JSON (e.g., `node -e "require('./context7.json')"`)
- [x] 2.2 Verify all fields match spec requirements (projectTitle, folders, exclusions, rules)
