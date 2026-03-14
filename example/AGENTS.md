# AI Development Guide — plutus example app

Expo-based React Native app demonstrating @byarcadia-app/plutus integration. This is the source of truth for how the library is consumed.

## Tech Stack

- Expo 54, React Native 0.81, Expo Router 6
- NativeWind 4 (Tailwind CSS for React Native)
- @byarcadia-app/aether (sibling UI library)
- react-native-purchases v9+ (RevenueCat — Test Store key)
- react-native-reanimated 4.x + react-native-worklets
- @callstack/liquid-glass
- expo-haptics, expo-linear-gradient, expo-symbols

## RevenueCat Test Store

For local development, the example app uses a RevenueCat Test Store API key (prefixed with `test_`). Configure the Test Store in your RevenueCat dashboard — no App Store Connect sandbox setup needed.

## Key Rule

This app must always reflect the current public API of plutus. Every hook and provider exported from `src/index.ts` should have a working usage example here.
