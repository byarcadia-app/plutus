import { act } from "@testing-library/react";
import Purchases, { PURCHASES_ERROR_CODE } from "react-native-purchases";
import { describe, expect, it, vi } from "vitest";

import {
  customerInfo,
  entitlement,
  purchaseResult,
  purchasesError,
  rescuePackage,
} from "../../test/fixtures";
import { renderInPlutus } from "../../test/render";
import { useRescuePaywall } from "./use-rescue-paywall";

type Options = Parameters<typeof useRescuePaywall>[0];

function renderRescue(options: Partial<Options> = {}) {
  const onTrackEvent = vi.fn();
  const rescueOffer = rescuePackage();
  const rendered = renderInPlutus(() => useRescuePaywall({ rescueOffer, ...options }), {
    callbacks: { onTrackEvent },
  });

  return { ...rendered, onTrackEvent, rescueOffer };
}

describe("useRescuePaywall", () => {
  it("buys the rescue package and reports the success", async () => {
    const onPurchaseSuccess = vi.fn();
    const { result, onTrackEvent, rescueOffer } = renderRescue({ onPurchaseSuccess });
    vi.mocked(Purchases.purchasePackage).mockResolvedValue(
      purchaseResult(customerInfo([entitlement()]), rescueOffer),
    );

    await act(() => result.current.handlePurchasePackage());

    expect(Purchases.purchasePackage).toHaveBeenCalledWith(rescueOffer);
    expect(onPurchaseSuccess).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_purchase_success", {
      is_rescue_offer: true,
    });
  });

  it("0.1.1 behaviour — changes in 0.2.0: a cancelled purchase counts as a failure", async () => {
    const onPurchaseFailed = vi.fn();
    const { result, onTrackEvent } = renderRescue({ onPurchaseFailed });
    vi.mocked(Purchases.purchasePackage).mockRejectedValue(
      purchasesError(PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR),
    );

    await act(() => result.current.handlePurchasePackage());

    expect(onPurchaseFailed).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_purchase_failed");
  });

  it("buys nothing without a rescue offer", async () => {
    const { result } = renderRescue({ rescueOffer: undefined });

    await act(() => result.current.handlePurchasePackage());

    expect(Purchases.purchasePackage).not.toHaveBeenCalled();
  });

  it("tracks the close as the rescue paywall's", () => {
    const onClose = vi.fn();
    const { result, onTrackEvent } = renderRescue({ onClose });

    act(() => result.current.handleClosePress());

    expect(onClose).toHaveBeenCalledOnce();
    expect(onTrackEvent).toHaveBeenCalledWith("paywall_close_button_pressed", {
      is_rescue_offer: true,
    });
  });
});
