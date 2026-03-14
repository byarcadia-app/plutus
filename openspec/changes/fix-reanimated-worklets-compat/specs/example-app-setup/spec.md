## MODIFIED Requirements

### Requirement: Package dependencies

The example app `package.json` SHALL declare `@byarcadia-app/plutus` as `workspace:*` and `@byarcadia-app/aether` as a dependency. It SHALL also include `react-native-purchases` to satisfy Plutus's peer dependency. It SHALL use `react-native-reanimated` at a version compatible with the resolved `react-native-worklets` peer dependency.

#### Scenario: Dependencies declared correctly

- **WHEN** `example/package.json` is read
- **THEN** `@byarcadia-app/plutus` is listed as `workspace:*`, `@byarcadia-app/aether` is listed as a dependency, `react-native-purchases` is present, and `react-native-reanimated` is at version `4.2.2` or later

#### Scenario: iOS pod install succeeds

- **WHEN** `pod install` runs in the `example/ios` directory
- **THEN** it completes without reanimated/worklets version validation errors
