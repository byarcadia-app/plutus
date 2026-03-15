## ADDED Requirements

### Requirement: context7.json file exists at project root
The project SHALL have a `context7.json` file in the repository root that conforms to the context7 schema (`https://context7.com/schema/context7.json`).

#### Scenario: File exists and is valid JSON
- **WHEN** the repository is cloned
- **THEN** a `context7.json` file SHALL exist at the project root and SHALL be valid JSON

#### Scenario: Schema reference is present
- **WHEN** `context7.json` is parsed
- **THEN** the `$schema` field SHALL be set to `https://context7.com/schema/context7.json`

### Requirement: Project metadata is accurate
The `context7.json` SHALL contain correct project metadata matching `package.json`.

#### Scenario: Project title matches package name
- **WHEN** `context7.json` is read
- **THEN** `projectTitle` SHALL be `@byarcadia-app/plutus`

#### Scenario: Description reflects library purpose
- **WHEN** `context7.json` is read
- **THEN** `description` SHALL describe plutus as a RevenueCat wrapper for React Native in-app purchases

### Requirement: Folders and exclusions are configured
The `context7.json` SHALL specify which folders to include and exclude for AI tool indexing.

#### Scenario: Source folders are included
- **WHEN** `context7.json` is read
- **THEN** `folders` SHALL include `src` and `docs`

#### Scenario: Build artifacts and dependencies are excluded
- **WHEN** `context7.json` is read
- **THEN** `excludeFolders` SHALL include at minimum: `dist`, `node_modules`, `example`, `.github`, `.changeset`, `.sisyphus`

#### Scenario: Lock files are excluded
- **WHEN** `context7.json` is read
- **THEN** `excludeFiles` SHALL include `pnpm-lock.yaml`

### Requirement: Development rules reflect plutus conventions
The `rules` array SHALL contain plutus-specific development conventions derived from CLAUDE.md.

#### Scenario: Callback-driven architecture rule
- **WHEN** `context7.json` rules are read
- **THEN** there SHALL be a rule about app-specific concerns (alerts, navigation, analytics) being handled via callbacks, never baked in

#### Scenario: Error handling rule
- **WHEN** `context7.json` rules are read
- **THEN** there SHALL be a rule about returning `PlutusError` in error callbacks, not translated strings

#### Scenario: Hook creation pattern rule
- **WHEN** `context7.json` rules are read
- **THEN** there SHALL be a rule about new hooks being created in `src/hooks/use-{name}.ts` and consuming `usePlutus()`
