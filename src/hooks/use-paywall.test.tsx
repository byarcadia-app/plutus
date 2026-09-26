import { act } from "@testing-library/react";
import { Linking } from "react-native";
import Purchases, { PACKAGE_TYPE, PURCHASES_ERROR_CODE } from "react-native-purchases";
import { describe, expect, it, vi } from "vitest";

import {
  annualPackage,
  customerInfo,
  entitlement,
  monthlyPackage,
  purchaseResult,
  purchasesError,
} from "../../test/fixtures";
import { renderInPlutus } from "../../test/render";
import { usePaywall } from "./use-paywall";

type Options = Parameters<typeof usePaywall>[0];

function renderPaywall(options: Partial<Options> = {}) {
  const onTrackEvent = vi.fn();
  const annualOffer = annualPackage();
  const monthlyOffer = monthlyPackage();
  const rendered = renderInPlutus(() => usePaywall({ annualOffer, monthlyOffer, ...options }), {
    callbacks: { onTrackEvent },
  });

  return { ...rendered, onTrackEvent, annualOffer, monthlyOffer };
}

describe("usePaywall", () => {
  it("preselects annual and tracks a switch of plan", () => {
    const { result, onTrackEvent } = renderPaywall();
    expect(result.current.subscriptionType).toBe("annual");

    act(() => result.current.handleSubscriptionTypeChange("monthly"));

    expect(result.current.subscriptionType).toBe("monthly");
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_subscription_type_changed", {
      type: "monthly",
    });
  });

  it("buys the selected package and reports the success", async () => {
    const onPurchaseSuccess = vi.fn();
    const { result, onTrackEvent, annualOffer } = renderPaywall({ onPurchaseSuccess });
    vi.mocked(Purchases.purchasePackage).mockResolvedValue(
      purchaseResult(customerInfo([entitlement()]), annualOffer),
    );

    await act(() => result.current.handlePurchasePackage());

    expect(Purchases.purchasePackage).toHaveBeenCalledWith(
      expect.objectContaining({ packageType: PACKAGE_TYPE.ANNUAL }),
    );
    expect(onPurchaseSuccess).toHaveBeenCalledWith("annual");
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_purchase_package", {
      type: "annual",
      is_rescue_offer: false,
    });
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_purchase_success", {
      type: "annual",
      is_rescue_offer: false,
    });
    expect(result.current.isPurchasing).toBe(false);
  });

  it("calls onPurchaseFailed when the store fails", async () => {
    const onPurchaseFailed = vi.fn();
    const { result, onTrackEvent } = renderPaywall({ onPurchaseFailed });
    vi.mocked(Purchases.purchasePackage).mockRejectedValue(
      purchasesError(PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR),
    );

    await act(() => result.current.handlePurchasePackage());

    expect(onPurchaseFailed).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_purchase_failed");
  });

  it("0.1.1 behaviour — changes in 0.2.0: a cancelled purchase counts as a failure", async () => {
    const onPurchaseFailed = vi.fn();
    const { result, onTrackEvent } = renderPaywall({ onPurchaseFailed });
    vi.mocked(Purchases.purchasePackage).mockRejectedValue(
      purchasesError(PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR),
    );

    await act(() => result.current.handlePurchasePackage());

    expect(onPurchaseFailed).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_purchase_failed");
  });

  it("buys nothing while an offer is missing", async () => {
    const { result } = renderPaywall({ monthlyOffer: undefined });

    await act(() => result.current.handlePurchasePackage());

    expect(Purchases.purchasePackage).not.toHaveBeenCalled();
  });

  it("reports a restore that brings the entitlement back", async () => {
    const onRestoreSuccess = vi.fn();
    const { result, onTrackEvent } = renderPaywall({ onRestoreSuccess });
    vi.mocked(Purchases.restorePurchases).mockResolvedValue(customerInfo([entitlement()]));

    await act(() => result.current.handleRestorePurchases());

    expect(onRestoreSuccess).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_restore_purchases_success");
  });

  it("reports a restore that finds nothing", async () => {
    const onRestoreFailed = vi.fn();
    const { result, onTrackEvent } = renderPaywall({ onRestoreFailed });
    vi.mocked(Purchases.restorePurchases).mockResolvedValue(customerInfo());

    await act(() => result.current.handleRestorePurchases());

    expect(onRestoreFailed).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_restore_failed");
  });

  it("closes and tracks the close", () => {
    const onClose = vi.fn();
    const { result, onTrackEvent } = renderPaywall({ onClose });

    act(() => result.current.handleClosePress());

    expect(onClose).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_close_button_pressed", {
      is_rescue_offer: false,
    });
  });

  it("opens the terms and privacy links it is given, and nothing without them", () => {
    const { result } = renderPaywall({ termsUrl: "https://example.com/terms" });

    act(() => result.current.handleTermsPress());
    act(() => result.current.handlePrivacyPress());

    expect(Linking.openURL).toHaveBeenCalledOnce();
    expect(Linking.openURL).toHaveBeenCalledWith("https://example.com/terms");
  });
});
