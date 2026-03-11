import { Linking } from "react-native";
import { useState } from "react";

import { usePlutus } from "../provider/use-plutus";
import type { UseRescuePaywallOptions } from "../types";

export const useRescuePaywall = ({
  rescueOffer,
  onClose,
  onPurchaseSuccess,
  onPurchaseFailed,
  onRestoreSuccess,
  onRestoreFailed,
  onTrackEvent: hookTrackEvent,
  termsUrl,
  privacyUrl,
}: UseRescuePaywallOptions) => {
  const {
    restorePurchases,
    purchasePackage,
    onTrackEvent: providerTrackEvent,
  } = usePlutus();

  const trackEvent = hookTrackEvent ?? providerTrackEvent;

  const [isPurchasing, setIsPurchasing] = useState(false);

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
    if (!rescueOffer) return;

    try {
      setIsPurchasing(true);
      trackEvent?.("paywall_purchase_package", {
        is_rescue_offer: true,
      });

      const purchased = await purchasePackage(rescueOffer);

      if (purchased) {
        trackEvent?.("paywall_purchase_success", {
          is_rescue_offer: true,
        });
        onPurchaseSuccess?.();
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
      is_rescue_offer: true,
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
    isPurchasing,
    handleTermsPress,
    handlePrivacyPress,
    handleClosePress,
    handleRestorePurchases,
    handlePurchasePackage,
  };
};
