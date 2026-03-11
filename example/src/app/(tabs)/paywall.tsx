import { useOfferings, usePaywall, usePlutus } from "@byarcadia-app/plutus";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

export default function PaywallScreen() {
  const { isPro } = usePlutus();
  const router = useRouter();

  const {
    isLoading,
    monthlyOffer,
    annualOffer,
    annualDiscountPercentage,
    monthlyHasTrial,
    annualHasTrial,
  } = useOfferings();

  const {
    subscriptionType,
    isPurchasing,
    handleSubscriptionTypeChange,
    handlePurchasePackage,
    handleRestorePurchases,
  } = usePaywall({
    monthlyOffer,
    annualOffer,
    onPurchaseSuccess: (type) => {
      console.log("[Example] Purchase success:", type);
      router.back();
    },
    onPurchaseFailed: () => {
      console.warn("[Example] Purchase failed");
    },
    onRestoreSuccess: () => {
      console.log("[Example] Restore success");
      router.back();
    },
    onRestoreFailed: () => {
      console.warn("[Example] Restore failed");
    },
  });

  if (isPro) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-2xl font-interBold text-foreground mb-2">You're Pro!</Text>
        <Text className="text-base font-inter text-muted-foreground text-center">
          You already have an active subscription.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-sm font-inter text-muted-foreground mt-4">Loading offerings...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-2xl font-interBold text-foreground mb-2">Go Pro</Text>
        <Text className="text-base font-inter text-muted-foreground mb-8">
          Unlock all premium features with a subscription.
        </Text>

        <View className="gap-3 mb-8">
          {annualOffer && (
            <Pressable
              className={`p-4 rounded-xl border-2 ${
                subscriptionType === "annual"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface"
              }`}
              onPress={() => handleSubscriptionTypeChange("annual")}
            >
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-interSemiBold text-foreground">Annual</Text>
                {annualDiscountPercentage && (
                  <View className="bg-success px-2 py-0.5 rounded-full">
                    <Text className="text-xs font-interSemiBold text-success-foreground">
                      Save {annualDiscountPercentage}%
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-sm font-inter text-muted-foreground">
                {annualOffer.product.priceString}/year
                {annualHasTrial && " — Free trial included"}
              </Text>
            </Pressable>
          )}

          {monthlyOffer && (
            <Pressable
              className={`p-4 rounded-xl border-2 ${
                subscriptionType === "monthly"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface"
              }`}
              onPress={() => handleSubscriptionTypeChange("monthly")}
            >
              <Text className="text-base font-interSemiBold text-foreground mb-1">Monthly</Text>
              <Text className="text-sm font-inter text-muted-foreground">
                {monthlyOffer.product.priceString}/month
                {monthlyHasTrial && " — Free trial included"}
              </Text>
            </Pressable>
          )}
        </View>

        {!monthlyOffer && !annualOffer && (
          <View className="p-4 bg-surface rounded-xl border border-border mb-8">
            <Text className="text-sm font-inter text-muted-foreground text-center">
              No offerings available. Make sure your RevenueCat project is configured with products.
            </Text>
          </View>
        )}

        <Pressable
          className="bg-primary rounded-xl py-4 items-center active:opacity-80 mb-4"
          onPress={handlePurchasePackage}
          disabled={isPurchasing || (!monthlyOffer && !annualOffer)}
        >
          {isPurchasing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-interSemiBold text-primary-foreground">Subscribe</Text>
          )}
        </Pressable>

        <Pressable
          className="py-3 items-center active:opacity-80"
          onPress={handleRestorePurchases}
          disabled={isPurchasing}
        >
          <Text className="text-sm font-inter text-muted-foreground">Restore Purchases</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
