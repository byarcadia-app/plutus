---
name: plutus-setup
description: Set up @byarcadia-app/plutus (RevenueCat wrapper) in a React Native app. Handles dependency installation, PlutusProvider integration into the root layout, environment variable configuration, and build verification. Use when the user wants to add in-app purchases, subscriptions, or a paywall to their React Native/Expo app using Plutus or RevenueCat, or when they say "set up plutus", "add subscriptions", "integrate payments", or "add IAP". Covers code-side setup only — for RevenueCat dashboard and App Store Connect configuration, refer the user to the Payment Setup guide in the plutus docs (docs/payment-setup.md in the plutus repo, or https://github.com/byarcadia-app/plutus/blob/main/docs/payment-setup.md).
---

# Plutus Setup

Integrate `@byarcadia-app/plutus` into an existing React Native / Expo project. This skill handles the code-side wiring — installing the package, wrapping the app with PlutusProvider, and configuring environment variables. It does NOT cover RevenueCat dashboard or App Store Connect configuration (that's a manual process documented in the [Payment Setup guide](https://github.com/byarcadia-app/plutus/blob/main/docs/payment-setup.md)).

## Why this skill exists

The tricky part of Plutus integration isn't the install — it's finding the right place in the provider tree to add PlutusProvider and wiring it correctly. PlutusProvider must:

- Wrap all screens that use Plutus hooks (`usePlutus`, `useOfferings`, `usePaywall`, `useRescuePaywall`)
- Sit inside any theme/font providers that it doesn't depend on
- Receive the API key from an environment variable (not hardcoded)
- Have the correct `entitlementName` that matches the RevenueCat dashboard

Getting any of these wrong causes silent failures or crashes (especially the empty apiKey → native SIGABRT issue).

## Workflow

Follow these steps in order. Verify each step before proceeding.

### Step 1: Detect project structure

Before touching any code, understand the project:

```
1. Package manager: check for pnpm-lock.yaml → yarn.lock → package-lock.json
2. Root layout: search for the entry point where providers live
   - Expo Router: src/app/_layout.tsx or app/_layout.tsx
   - React Navigation: App.tsx or src/App.tsx
   - Look for existing provider wrappers (ThemeProvider, SafeAreaProvider, etc.)
3. Existing Plutus: grep for "@byarcadia-app/plutus" in package.json
   - If already installed, skip to Step 3 (just verify wiring)
4. Env files: check for .env, .env.local, .env.example, .env.development
```

### Step 2: Install dependencies

Using the detected package manager:

```bash
# pnpm (preferred)
pnpm add @byarcadia-app/plutus react-native-purchases

# yarn
yarn add @byarcadia-app/plutus react-native-purchases

# npm
npm install @byarcadia-app/plutus react-native-purchases
```

`react-native-purchases` v9+ is required as a peer dependency.

### Step 3: Add PlutusProvider to root layout

This is the critical step. Read the root layout file, understand the existing provider hierarchy, then add PlutusProvider.

**Placement rules:**

- PlutusProvider should wrap the navigation/screen content
- It can sit inside or outside theme providers — it doesn't depend on them
- If there are multiple providers, add PlutusProvider as an inner wrapper (close to the screens)
- It MUST wrap any component that calls `usePlutus()`, `useOfferings()`, `usePaywall()`, or `useRescuePaywall()`

**Required props:**

- `apiKey` — from environment variable, never hardcoded
- `entitlementName` — the RevenueCat entitlement identifier (ask the user if unknown, default: `"pro"`)

**Recommended props:**

- `callbacks.onError` — at minimum, log errors
- `callbacks.onTrackEvent` — analytics fallback

**Example integration** (Expo Router with existing providers):

```tsx
import { PlutusProvider } from "@byarcadia-app/plutus";

// Inside the root layout component's return:
<ExistingOuterProvider>
  <PlutusProvider
    apiKey={process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? ""}
    entitlementName="pro"
    callbacks={{
      onError: (error) => console.warn("[Plutus]", error.code, error.cause),
      onTrackEvent: (name, params) => console.log("[Plutus Event]", name, params),
    }}
  >
    {/* existing navigation / screens */}
  </PlutusProvider>
</ExistingOuterProvider>;
```

**What to ask the user if unclear:**

- "What entitlement name do you use in RevenueCat?" (default: `"pro"`)
- "Do you have an analytics service? I can wire `onTrackEvent` to it."
- "Do you already have a RevenueCat API key, or do you need a test key?"

Read `references/provider-api.md` for the full PlutusProvider API (all props, callbacks, and their types).

### Step 4: Configure environment variables

**Always create/update `.env.local`:**

```
EXPO_PUBLIC_REVENUECAT_KEY=your_revenuecat_api_key_here
```

**If `.env.example` (or `.env.template`, `.env.sample`) exists**, add the variable there too with an empty value or placeholder:

```
EXPO_PUBLIC_REVENUECAT_KEY=
```

**If the project uses EAS (check for `eas.json` or `app.json` with `expo` config)**, mention:

```bash
# For production builds, set the key as an EAS secret:
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_KEY --value <your-key>
```

**If `.gitignore` doesn't include `.env.local`**, add it.

### Step 5: Verify the integration

Run the project's typecheck command:

```bash
# Check for tsconfig.json to determine the right command
npx tsc --noEmit
# or if the project has a check script:
pnpm check  # or yarn check, npm run check
```

Common issues after setup:

- **Type error on `process.env.EXPO_PUBLIC_*`**: Needs `@types/react-native` or Expo's env type declarations
- **"Cannot find module @byarcadia-app/plutus"**: Run `npx expo install` or ensure metro cache is cleared
- **Empty apiKey crash**: PlutusProvider guards against this since v0.1.0, but warn the user to set the env var before testing

### Step 6: Next steps

After successful setup, tell the user:

> PlutusProvider is configured. Next steps:
>
> 1. **Get your API key**: Follow the [Payment Setup guide](https://github.com/byarcadia-app/plutus/blob/main/docs/payment-setup.md) to configure RevenueCat and App Store Connect, then paste your API key into `.env.local`
> 2. **Build your paywall**: Use `useOfferings()` and `usePaywall()` hooks — see [Hooks documentation](https://github.com/byarcadia-app/plutus/blob/main/docs/hooks.md) for the full API
> 3. **Handle errors**: Configure `onError` callback — see [Errors documentation](https://github.com/byarcadia-app/plutus/blob/main/docs/errors.md)
>
> The [`example/`](https://github.com/byarcadia-app/plutus/tree/main/example) directory in the plutus repo contains a complete working integration you can reference.

## Common patterns

### Analytics integration

If the project uses an analytics library, wire it into PlutusProvider:

```tsx
callbacks={{
  onTrackEvent: (name, params) => {
    analytics.track(name, params);  // Amplitude, Mixpanel, PostHog, etc.
  },
  onCustomerInfoUpdated: (info, { isPro, isInTrial }) => {
    analytics.setUserProperty("is_pro", isPro);
    analytics.setUserProperty("is_in_trial", isInTrial);
  },
}}
```

### Custom offering identifiers

If the user's RevenueCat offerings don't use the default `"default"` / `"rescue"` identifiers:

```tsx
<PlutusProvider
  offerings={{ default: "main_paywall", rescue: "discount_offer" }}
  // ...
>
```

### Test Store key for development

For local development without App Store Connect sandbox:

```
# .env.local
EXPO_PUBLIC_REVENUECAT_KEY=test_xxxxxxxxxxxxx
```

RevenueCat Test Store keys (prefixed with `test_`) work without real products.
