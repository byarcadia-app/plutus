import { act, render, waitFor } from "@testing-library/react";
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from "react-native-purchases";
import { describe, expect, it, vi } from "vitest";

import { emitCustomerInfo, listenerCount } from "../../test/fake-purchases";
import {
  annualPackage,
  customerInfo,
  entitlement,
  purchaseResult,
  purchasesError,
} from "../../test/fixtures";
import { renderInPlutus } from "../../test/render";
import { PlutusProvider } from "./plutus-provider";
import { usePlutus } from "./use-plutus";

async function renderReady(props: Parameters<typeof renderInPlutus>[1] = {}) {
  const rendered = renderInPlutus(() => usePlutus(), props);
  await waitFor(() => expect(rendered.result.current.isReady).toBe(true));

  return rendered;
}

describe("PlutusProvider", () => {
  it("configures RevenueCat with the api key at the default log level", async () => {
    await renderReady();

    expect(Purchases.setLogLevel).toHaveBeenCalledWith(LOG_LEVEL.ERROR);
    expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: "test_key" });
  });

  it("never configures RevenueCat without an api key", async () => {
    const onError = vi.fn();
    const { result } = renderInPlutus(() => usePlutus(), { apiKey: " ", callbacks: { onError } });

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "INIT_FAILED" })),
    );
    expect(Purchases.configure).not.toHaveBeenCalled();
    expect(result.current.isReady).toBe(false);
  });

  it("reports INIT_FAILED and stays not ready when configuring throws", async () => {
    const onError = vi.fn();
    const failure = new Error("configure failed");
    vi.mocked(Purchases.configure).mockImplementation(() => {
      throw failure;
    });

    const { result } = renderInPlutus(() => usePlutus(), { callbacks: { onError } });

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "INIT_FAILED", cause: failure }),
      ),
    );
    expect(result.current.isReady).toBe(false);
  });

  it("makes a person Pro when their customer info carries the entitlement", async () => {
    const { result } = await renderReady();

    act(() => emitCustomerInfo(customerInfo([entitlement()], "https://apps.apple.com/account")));

    expect(result.current).toMatchObject({
      isPro: true,
      isInTrial: false,
      managementURL: "https://apps.apple.com/account",
    });
  });

  it("reads a trial from the entitlement's period type", async () => {
    const { result } = await renderReady();

    act(() => emitCustomerInfo(customerInfo([entitlement({ periodType: "TRIAL" })])));

    expect(result.current).toMatchObject({ isPro: true, isInTrial: true });
  });

  it("ignores an active entitlement under another name", async () => {
    const { result } = await renderReady();

    act(() => emitCustomerInfo(customerInfo([entitlement({ identifier: "Legacy" })])));

    expect(result.current.isPro).toBe(false);
  });

  it("hands onCustomerInfoUpdated the customer info and the derived state", async () => {
    const onCustomerInfoUpdated = vi.fn();
    await renderReady({ callbacks: { onCustomerInfoUpdated } });
    const info = customerInfo([entitlement({ periodType: "TRIAL" })]);

    act(() => emitCustomerInfo(info));

    expect(onCustomerInfoUpdated).toHaveBeenCalledWith(info, { isPro: true, isInTrial: true });
  });

  it("removes its customer info listener on unmount", async () => {
    const { unmount } = await renderReady();
    expect(listenerCount()).toBe(1);

    unmount();

    expect(listenerCount()).toBe(0);
  });

  it("0.1.1 behaviour — changes in 0.2.0: reads no customer info until the SDK reports it", async () => {
    const { result } = await renderReady();

    expect(Purchases.getCustomerInfo).not.toHaveBeenCalled();
    expect(result.current.isPro).toBe(false);
  });

  it("0.1.1 behaviour — changes in 0.2.0: a new callbacks object configures RevenueCat again", async () => {
    const tree = () => (
      <PlutusProvider apiKey="test_key" entitlementName="Pro" callbacks={{ onError: () => {} }}>
        {null}
      </PlutusProvider>
    );
    const { rerender } = render(tree());
    await waitFor(() => expect(Purchases.configure).toHaveBeenCalledTimes(1));

    rerender(tree());

    await waitFor(() => expect(Purchases.configure).toHaveBeenCalledTimes(2));
  });

  describe("purchasePackage", () => {
    it("resolves true and makes the person Pro when the purchase grants the entitlement", async () => {
      const { result } = await renderReady();
      const pkg = annualPackage();
      vi.mocked(Purchases.purchasePackage).mockResolvedValue(
        purchaseResult(customerInfo([entitlement()]), pkg),
      );

      let outcome: boolean | undefined;
      await act(async () => {
        outcome = await result.current.purchasePackage(pkg);
      });

      expect(outcome).toBe(true);
      expect(result.current.isPro).toBe(true);
    });

    it("resolves false when the purchase leaves the entitlement inactive", async () => {
      const { result } = await renderReady();
      const pkg = annualPackage();
      vi.mocked(Purchases.purchasePackage).mockResolvedValue(purchaseResult(customerInfo(), pkg));

      let outcome: boolean | undefined;
      await act(async () => {
        outcome = await result.current.purchasePackage(pkg);
      });

      expect(outcome).toBe(false);
    });

    it("resolves undefined and reports nothing when the person cancels", async () => {
      const onError = vi.fn();
      const { result } = await renderReady({ callbacks: { onError } });
      vi.mocked(Purchases.purchasePackage).mockRejectedValue(
        purchasesError(PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR),
      );

      let outcome: boolean | undefined = false;
      await act(async () => {
        outcome = await result.current.purchasePackage(annualPackage());
      });

      expect(outcome).toBeUndefined();
      expect(onError).not.toHaveBeenCalled();
    });

    it("0.1.1 behaviour — changes in 0.2.0: resolves undefined when the store fails", async () => {
      const onError = vi.fn();
      const { result } = await renderReady({ callbacks: { onError } });
      const pkg = annualPackage();
      vi.mocked(Purchases.purchasePackage).mockRejectedValue(
        purchasesError(PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR),
      );

      let outcome: boolean | undefined = false;
      await act(async () => {
        outcome = await result.current.purchasePackage(pkg);
      });

      expect(outcome).toBeUndefined();
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "PURCHASE_FAILED", package: pkg }),
      );
    });
  });

  describe("restorePurchases", () => {
    it("resolves true and makes the person Pro when the entitlement comes back", async () => {
      const { result } = await renderReady();
      vi.mocked(Purchases.restorePurchases).mockResolvedValue(customerInfo([entitlement()]));

      let outcome = false;
      await act(async () => {
        outcome = await result.current.restorePurchases();
      });

      expect(outcome).toBe(true);
      expect(result.current.isPro).toBe(true);
    });

    it("resolves false when nothing is restored", async () => {
      const { result } = await renderReady();
      vi.mocked(Purchases.restorePurchases).mockResolvedValue(customerInfo());

      let outcome = true;
      await act(async () => {
        outcome = await result.current.restorePurchases();
      });

      expect(outcome).toBe(false);
    });

    it("resolves false and reports RESTORE_FAILED when the store fails", async () => {
      const onError = vi.fn();
      const { result } = await renderReady({ callbacks: { onError } });
      vi.mocked(Purchases.restorePurchases).mockRejectedValue(
        purchasesError(PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR),
      );

      let outcome = true;
      await act(async () => {
        outcome = await result.current.restorePurchases();
      });

      expect(outcome).toBe(false);
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "RESTORE_FAILED" }));
    });
  });
});
