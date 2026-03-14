## ADDED Requirements

### Requirement: pnpm workspace configuration

The project SHALL have a `pnpm-workspace.yaml` at root that includes `example/` as a workspace package.

#### Scenario: Workspace resolves local library

- **WHEN** `pnpm install` is run from the workspace root
- **THEN** `@byarcadia-app/plutus` resolves to the local library source in the example app

### Requirement: Expo app scaffolding

The example app SHALL be an Expo 54 app with Expo Router, located at `example/`.

#### Scenario: App structure exists

- **WHEN** the `example/` directory is inspected
- **THEN** it contains `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `tailwind.config.js`, and `src/` directory

#### Scenario: App starts successfully

- **WHEN** `pnpm example:start` is run from the root
- **THEN** the Expo development server starts and the app loads on iOS simulator

### Requirement: Package dependencies

The example app `package.json` SHALL declare `@byarcadia-app/plutus` as `workspace:*` and `@byarcadia-app/aether` as a dependency. It SHALL also include `react-native-purchases` to satisfy Plutus's peer dependency.

#### Scenario: Dependencies declared correctly

- **WHEN** `example/package.json` is read
- **THEN** `@byarcadia-app/plutus` is listed as `workspace:*`, `@byarcadia-app/aether` is listed as a dependency, and `react-native-purchases` is present

### Requirement: Metro configuration for monorepo

The metro config SHALL set `watchFolders` to include the workspace root and resolve `react` and `react-native` to the example's own `node_modules` to avoid duplicate instances.

#### Scenario: Metro resolves modules correctly

- **WHEN** Metro bundles the app
- **THEN** only one copy of `react` and `react-native` is loaded, and changes to the root `src/` trigger hot reload

### Requirement: NativeWind and Tailwind setup

The example app SHALL configure NativeWind with a `tailwind.config.js` that includes aether-ui's Tailwind preset and scans both `example/src/` and root `src/` for class usage.

#### Scenario: Tailwind classes work

- **WHEN** a component uses Tailwind classes from aether's preset
- **THEN** styles are applied correctly at runtime

### Requirement: Environment variable configuration

The example app SHALL read `EXPO_PUBLIC_REVENUECAT_KEY` from environment. A `.env.example` file SHALL document required variables.

#### Scenario: Env file documents required variables

- **WHEN** `.env.example` in the example directory is inspected
- **THEN** it contains `EXPO_PUBLIC_REVENUECAT_KEY` with a placeholder value

### Requirement: Root workspace scripts

The root `package.json` SHALL include convenience scripts for running the example app.

#### Scenario: Scripts available

- **WHEN** root `package.json` is inspected
- **THEN** it contains `example:start` and `example:ios` scripts that forward to the example workspace
