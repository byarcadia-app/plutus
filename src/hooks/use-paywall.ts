import { Linking } from "react-native";
import { useState } from "react";
import type { PurchasesPackage } from "react-native-purchases";

import { usePlutus } from "../provider/use-plutus";

interface UsePaywallOptions {
  monthlyOffer?: PurchasesPackage;
  annualOffer?: PurchasesPackage;
  onClose?: () => void;
  onPurchaseSuccess?: (subscriptionType: "monthly" | "annual") => void;
  onPurchaseFailed?: () => void;
  onRestoreSuccess?: () => void;
  onRestoreFailed?: () => void;
  termsUrl?: string;
  privacyUrl?: string;
}

export const usePaywall = ({
  monthlyOffer,
  annualOffer,
  onClose,
  onPurchaseSuccess,
  onPurchaseFailed,
  onRestoreSuccess,
  onRestoreFailed,
  termsUrl,
  privacyUrl,
}: UsePaywallOptions) => {
  const { restorePurchases, purchasePackage, onTrackEvent } = usePlutus();

  const [subscriptionType, setSubscriptionType] = useState<"monthly" | "annual">("annual");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleSubscriptionTypeChange = (type: "monthly" | "annual") => {
    onTrackEvent?.("paywall_subscription_type_changed", { type });
    setSubscriptionType(type);
  };

  const handleRestorePurchases = async () => {
    onTrackEvent?.("paywall_restore_purchases");
    setIsPurchasing(true);

    try {
      const restored = await restorePurchases();

      if (restored) {
        onTrackEvent?.("paywall_restore_purchases_success");
        onRestoreSuccess?.();
      } else {
        onTrackEvent?.("paywall_restore_failed");
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
      onTrackEvent?.("paywall_purchase_package", {
        type: subscriptionType,
        is_rescue_offer: false,
      });

      const selectedOffer = subscriptionType === "monthly" ? monthlyOffer : annualOffer;
      const purchased = await purchasePackage(selectedOffer);

      if (purchased) {
        onTrackEvent?.("paywall_purchase_success", {
          type: subscriptionType,
          is_rescue_offer: false,
        });
        onPurchaseSuccess?.(subscriptionType);
      } else {
        onTrackEvent?.("paywall_purchase_failed");
        onPurchaseFailed?.();
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClosePress = () => {
    onTrackEvent?.("paywall_close_button_pressed", {
      is_rescue_offer: false,
    });
    onClose?.();
  };

  const handleTermsPress = () => {
    onTrackEvent?.("paywall_terms_pressed");
    if (termsUrl) Linking.openURL(termsUrl);
  };

  const handlePrivacyPress = () => {
    onTrackEvent?.("paywall_privacy_pressed");
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
