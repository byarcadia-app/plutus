## 1. Workspace Setup

- [x] 1.1 Create `pnpm-workspace.yaml` at root with `example/` as workspace member
- [x] 1.2 Add `example:start` and `example:ios` scripts to root `package.json`

## 2. Example App Scaffolding

- [x] 2.1 Create `example/package.json` with dependencies: `@byarcadia-app/plutus` (workspace:*), `@byarcadia-app/aether`, `react-native-purchases`, Expo 54, Expo Router, React 19, React Native, NativeWind, and related deps
- [x] 2.2 Create `example/app.json` with Expo config (name, slug, scheme, plugins for expo-router and expo-font)
- [x] 2.3 Create `example/tsconfig.json` extending `expo/tsconfig.base` with `~/*` path alias
- [x] 2.4 Create `example/babel.config.js` with nativewind jsxImportSource and module-resolver for `~` alias
- [x] 2.5 Create `example/metro.config.js` with NativeWind integration, watchFolders for workspace root, and extraNodeModules for react/react-native deduplication
- [x] 2.6 Create `example/tailwind.config.js` with nativewind preset, aether tailwind preset, and content paths for both example and root src
- [x] 2.7 Create `example/src/globals.css` with Tailwind directives
- [x] 2.8 Create `example/.env.example` documenting `EXPO_PUBLIC_REVENUECAT_KEY`

## 3. App Layout and Navigation

- [x] 3.1 Create `example/src/app/_layout.tsx` — root layout wrapping app with AetherProvider and PlutusProvider (reading RevenueCat key from env)
- [x] 3.2 Create `example/src/app/(tabs)/_layout.tsx` — tab navigation with Home and Paywall tabs

## 4. Screens

- [x] 4.1 Create `example/src/app/(tabs)/index.tsx` — home screen showing app title, description, subscription status (usePlutus), and "Show Paywall" button
- [x] 4.2 Create `example/src/app/(tabs)/paywall.tsx` — paywall screen using useOfferings and usePaywall to display monthly/annual options, pricing, discount percentage, subscription selection, purchase button, and restore purchases

## 5. Install and Verify

- [x] 5.1 Run `pnpm install` from workspace root to link dependencies
- [x] 5.2 Verify the example app starts with `pnpm example:start`
