## Context

Plutus is a standalone library (`@byarcadia-app/plutus`) that wraps RevenueCat for React Native. Currently there is no example app to validate integration or demonstrate usage. The aether-ui package follows a proven pattern: a pnpm workspace with an `example/` Expo app that imports the library via `workspace:*`. The umbra app shows how RevenueCat is consumed in production with providers, hooks, and a paywall screen.

## Goals / Non-Goals

**Goals:**

- Provide a runnable Expo example app that demonstrates Plutus integration end-to-end
- Follow the same workspace + example app pattern as aether-ui
- Show minimal but complete paywall flow: provider setup → offerings display → purchase
- Use aether-ui design system for consistent styling (NativeWind + `@byarcadia-app/aether`)

**Non-Goals:**

- Production-ready paywall UI (this is a demo, we'll iterate)
- Storybook integration (can be added later)
- Rescue paywall demonstration (keep it minimal for v1)
- Android testing (iOS-first, same as umbra)
- Onboarding flow or entry limits — just the paywall

## Decisions

### 1. pnpm workspace monorepo

**Decision:** Add `pnpm-workspace.yaml` at root with `example/` as a workspace member.

**Rationale:** Same pattern as aether-ui. Allows `workspace:*` linking so the example app always uses the local library source. Metro's `watchFolders` enables hot reload of library changes.

**Alternative:** npm link or file: protocol — fragile, breaks on reinstall.

### 2. Expo with Expo Router

**Decision:** Use Expo 54 + Expo Router for the example app, matching umbra's setup.

**Rationale:** Expo is the standard for new RN apps. Expo Router provides file-based routing. Keeps alignment with both reference projects.

### 3. NativeWind + aether-ui design system

**Decision:** Use `@byarcadia-app/aether` for UI components and NativeWind/Tailwind for styling.

**Rationale:** Consistent with the byarcadia ecosystem. Provides ready-made Button, Card, Text components. Tailwind preset from aether handles theming.

### 4. Minimal screen structure

**Decision:** Two screens only — Home (info) and Paywall (demo).

**Rationale:** Keep it minimal. The paywall screen is the core demonstration. Home screen provides context and navigation.

### 5. RevenueCat API key via environment variable

**Decision:** Use `EXPO_PUBLIC_REVENUECAT_KEY` env var, same as umbra.

**Rationale:** Keeps secrets out of source. Matches the established pattern.

## Risks / Trade-offs

- **[Risk] RevenueCat requires a real API key to test** → Document that the example needs a `.env` with a valid key. Provide `.env.example`.
- **[Risk] react/react-native version mismatches between root and example** → Pin versions in example's package.json and use metro's `extraNodeModules` to resolve correctly (same as aether-ui pattern).
- **[Trade-off] Minimal UI won't showcase all Plutus features** → Acceptable for v1. We'll add rescue paywall and more screens in later iterations.
- **[Trade-off] Adding aether-ui as dependency increases setup complexity** → Worth it for consistent styling and real-world integration demonstration.
