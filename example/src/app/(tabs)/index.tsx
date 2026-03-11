import { usePlutus } from "@byarcadia-app/plutus";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { isPro, isInTrial, isReady } = usePlutus();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-3xl font-interBold text-foreground mb-2">Plutus Example</Text>
        <Text className="text-base font-inter text-muted-foreground mb-8">
          Minimal example demonstrating @byarcadia-app/plutus integration with RevenueCat.
        </Text>

        <View className="p-4 bg-surface rounded-xl border border-border mb-6">
          <Text className="text-sm font-interSemiBold text-surface-foreground mb-2">
            Subscription Status
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm font-inter text-muted-foreground">SDK Ready</Text>
              <Text className="text-sm font-interMedium text-foreground">
                {isReady ? "Yes" : "No"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-inter text-muted-foreground">Status</Text>
              <Text className="text-sm font-interMedium text-foreground">
                {isPro ? (isInTrial ? "Trial" : "Pro") : "Free"}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80"
          onPress={() => router.push("/paywall")}
        >
          <Text className="text-base font-interSemiBold text-primary-foreground">Show Paywall</Text>
        </Pressable>

        <View className="mt-8 p-4 bg-surface rounded-xl border border-border">
          <Text className="text-sm font-interSemiBold text-surface-foreground mb-1">
            @byarcadia-app/plutus
          </Text>
          <Text className="text-xs font-inter text-muted-foreground">
            This app demonstrates @byarcadia-app/plutus integration with Expo via pnpm workspace.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
