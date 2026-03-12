# AI Development Guide — plutus example app

Expo-based React Native app demonstrating @byarcadia-app/plutus integration. This is the source of truth for how the library is consumed.

## Tech Stack

- Expo 54, React Native 0.81, Expo Router 6
- NativeWind 4 (Tailwind CSS for React Native)
- @byarcadia-app/aether (sibling UI library)

## Key Rule

This app must always reflect the current public API of plutus. Every hook and provider exported from `src/index.ts` should have a working usage example here.
