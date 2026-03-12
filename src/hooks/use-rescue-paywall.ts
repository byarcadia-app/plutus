import { Linking } from "react-native";
import { useState } from "react";
import type { PurchasesPackage } from "react-native-purchases";

import { usePlutus } from "../provider/use-plutus";

interface UseRescuePaywallOptions {
  rescueOffer?: PurchasesPackage;
  onClose?: () => void;
  onPurchaseSuccess?: () => void;
  onPurchaseFailed?: () => void;
  onRestoreSuccess?: () => void;
  onRestoreFailed?: () => void;
  termsUrl?: string;
  privacyUrl?: string;
}

export const useRescuePaywall = ({
  rescueOffer,
  onClose,
  onPurchaseSuccess,
  onPurchaseFailed,
  onRestoreSuccess,
  onRestoreFailed,
  termsUrl,
  privacyUrl,
}: UseRescuePaywallOptions) => {
  const { restorePurchases, purchasePackage, onTrackEvent } = usePlutus();

  const [isPurchasing, setIsPurchasing] = useState(false);

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
    if (!rescueOffer) return;

    try {
      setIsPurchasing(true);
      onTrackEvent?.("paywall_purchase_package", {
        is_rescue_offer: true,
      });

      const purchased = await purchasePackage(rescueOffer);

      if (purchased) {
        onTrackEvent?.("paywall_purchase_success", {
          is_rescue_offer: true,
        });
        onPurchaseSuccess?.();
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
      is_rescue_offer: true,
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
    isPurchasing,
    handleTermsPress,
    handlePrivacyPress,
    handleClosePress,
    handleRestorePurchases,
    handlePurchasePackage,
  };
};
