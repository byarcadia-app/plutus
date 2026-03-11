import { Linking } from "react-native";
import { useState } from "react";

import { usePlutus } from "../provider/use-plutus";
import type { UsePaywallOptions } from "../types";

export const usePaywall = ({
  monthlyOffer,
  annualOffer,
  onClose,
  onPurchaseSuccess,
  onPurchaseFailed,
  onRestoreSuccess,
  onRestoreFailed,
  onTrackEvent: hookTrackEvent,
  termsUrl,
  privacyUrl,
}: UsePaywallOptions) => {
  const {
    restorePurchases,
    purchasePackage,
    onTrackEvent: providerTrackEvent,
  } = usePlutus();

  const trackEvent = hookTrackEvent ?? providerTrackEvent;

  const [subscriptionType, setSubscriptionType] = useState<
    "monthly" | "annual"
  >("annual");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleSubscriptionTypeChange = (type: "monthly" | "annual") => {
    trackEvent?.("paywall_subscription_type_changed", { type });
    setSubscriptionType(type);
  };

  const handleRestorePurchases = async () => {
    trackEvent?.("paywall_restore_purchases");
    setIsPurchasing(true);

    try {
      const restored = await restorePurchases();

      if (restored) {
        trackEvent?.("paywall_restore_purchases_success");
        onRestoreSuccess?.();
      } else {
        trackEvent?.("paywall_restore_failed");
        onRestoreFailed?.();
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePurchasePackage = async () => {
    if (!monthlyOffer || !annualOffer) return;

    try {
      setIsPurchasing(true);
      trackEvent?.("paywall_purchase_package", {
        type: subscriptionType,
        is_rescue_offer: false,
      });

      const selectedOffer =
        subscriptionType === "monthly" ? monthlyOffer : annualOffer;
      const purchased = await purchasePackage(selectedOffer);

      if (purchased) {
        trackEvent?.("paywall_purchase_success", {
          type: subscriptionType,
          is_rescue_offer: false,
        });
        onPurchaseSuccess?.(subscriptionType);
      } else {
        trackEvent?.("paywall_purchase_failed");
        onPurchaseFailed?.();
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClosePress = () => {
    trackEvent?.("paywall_close_button_pressed", {
      is_rescue_offer: false,
    });
    onClose?.();
  };

  const handleTermsPress = () => {
    trackEvent?.("paywall_terms_pressed");
    if (termsUrl) Linking.openURL(termsUrl);
  };

  const handlePrivacyPress = () => {
    trackEvent?.("paywall_privacy_pressed");
    if (privacyUrl) Linking.openURL(privacyUrl);
  };

  return {
    subscriptionType,
    isPurchasing,
    handleSubscriptionTypeChange,
    handleTermsPress,
    handlePrivacyPress,
    handleClosePress,
    handleRestorePurchases,
    handlePurchasePackage,
  };
};
