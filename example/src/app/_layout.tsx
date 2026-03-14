import { AetherProvider, useInterFonts, useNavigationTheme } from "@byarcadia-app/aether";
import { PlutusProvider } from "@byarcadia-app/plutus";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import "react-native-reanimated";
import "../globals.css";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { fontsLoaded, fontError } = useInterFonts();
  const navigationTheme = useNavigationTheme();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AetherProvider>
      <PlutusProvider
        apiKey={process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? ""}
        entitlementName="Pro"
        callbacks={{
          onError: (error) => console.warn("[Plutus Error]", error.code, error.cause),
          onTrackEvent: (name, params) => console.log("[Plutus Event]", name, params),
        }}
      >
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PlutusProvider>
    </AetherProvider>
  );
}
