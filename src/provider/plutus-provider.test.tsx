import { act, render, waitFor } from "@testing-library/react";
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from "react-native-purchases";
import type { CustomerInfo } from "react-native-purchases";
import { describe, expect, it, vi } from "vitest";

import { deferred } from "../../test/deferred";
import { emitCustomerInfo, listenerCount } from "../../test/fake-purchases";
import {
  annualPackage,
  customerInfo,
  entitlement,
  purchaseResult,
  purchasesError,
} from "../../test/fixtures";
import { renderInPlutus, type ProviderProps } from "../../test/render";
import { PlutusProvider } from "./plutus-provider";
import { usePlutus } from "./use-plutus";

async function renderReady(props: ProviderProps = {}) {
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
    expect(result.current.initError).toMatchObject({ code: "INIT_FAILED" });
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
    expect(result.current.initError).toMatchObject({ code: "INIT_FAILED", cause: failure });
    expect(Purchases.getCustomerInfo).not.toHaveBeenCalled();
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

    expect(onCustomerInfoUpdated).toHaveBeenCalledWith(info, {
      isPro: true,
      isInTrial: true,
      expirationDate: "2026-10-01T10:00:00.000Z",
    });
  });

  it("exposes when the entitlement ends, and nothing without one", async () => {
    const { result } = await renderReady();

    act(() =>
      emitCustomerInfo(
        customerInfo([
          entitlement({ periodType: "TRIAL", expirationDate: "2026-09-08T10:00:00Z" }),
        ]),
      ),
    );
    expect(result.current.expirationDate).toBe("2026-09-08T10:00:00Z");

    act(() => emitCustomerInfo(customerInfo()));
    expect(result.current.expirationDate).toBeNull();
  });

  it("removes its customer info listener on unmount", async () => {
    const { unmount } = await renderReady();
    expect(listenerCount()).toBe(1);

    unmount();

    expect(listenerCount()).toBe(0);
  });

  it("reads customer info right after configuring, before the SDK reports any", async () => {
    vi.mocked(Purchases.getCustomerInfo).mockResolvedValue(customerInfo([entitlement()]));

    const { result } = renderInPlutus(() => usePlutus());
    expect(result.current.isCustomerInfoLoaded).toBe(false);

    await waitFor(() => expect(result.current.isCustomerInfoLoaded).toBe(true));
    expect(result.current.isPro).toBe(true);
  });

  it("drops the start-up read when the SDK reported newer customer info first", async () => {
    const startUpRead = deferred<CustomerInfo>();
    vi.mocked(Purchases.getCustomerInfo).mockReturnValue(startUpRead.promise);
    const { result } = await renderReady();

    act(() => emitCustomerInfo(customerInfo([entitlement()])));
    await act(async () => startUpRead.resolve(customerInfo()));

    expect(result.current.isPro).toBe(true);
  });

  it("reports CUSTOMER_INFO_FAILED and waits for the SDK when the start-up read fails", async () => {
    const onError = vi.fn();
    vi.mocked(Purchases.getCustomerInfo).mockRejectedValue(new Error("offline"));
    const { result } = await renderReady({ callbacks: { onError } });

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ code: "CUSTOMER_INFO_FAILED" }),
      ),
    );
    expect(result.current.isCustomerInfoLoaded).toBe(false);

    act(() => emitCustomerInfo(customerInfo()));

    expect(result.current.isCustomerInfoLoaded).toBe(true);
  });

  it("configures RevenueCat once when callbacks arrive inline, and calls the latest ones", async () => {
    const first = vi.fn();
    const second = vi.fn();
    const tree = (onCustomerInfoUpdated: () => void) => (
      <PlutusProvider apiKey="test_key" entitlementName="Pro" callbacks={{ onCustomerInfoUpdated }}>
        {null}
      </PlutusProvider>
    );
    const { rerender } = render(tree(first));
    // The start-up read reaches the callbacks of that render.
    await waitFor(() => expect(first).toHaveBeenCalledOnce());

    rerender(tree(second));
    await act(async () => {});
    act(() => emitCustomerInfo(customerInfo()));

    expect(Purchases.configure).toHaveBeenCalledOnce();
    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it("honours a new entitlement name without configuring again", async () => {
    let isPro = false;
    function Probe() {
      isPro = usePlutus().isPro;
      return null;
    }
    const tree = (entitlementName: string) => (
      <PlutusProvider apiKey="test_key" entitlementName={entitlementName}>
        <Probe />
      </PlutusProvider>
    );
    const { rerender } = render(tree("Pro"));
    await waitFor(() => expect(listenerCount()).toBe(1));

    rerender(tree("Legacy"));
    act(() => emitCustomerInfo(customerInfo([entitlement({ identifier: "Legacy" })])));

    expect(isPro).toBe(true);
    expect(Purchases.configure).toHaveBeenCalledOnce();
  });

  it("leaves RevenueCat alone when unmounted before the start finished", async () => {
    const logLevelSet = deferred<void>();
    vi.mocked(Purchases.setLogLevel).mockReturnValue(logLevelSet.promise);
    const { unmount } = renderInPlutus(() => usePlutus());

    unmount();
    await act(async () => logLevelSet.resolve());

    expect(Purchases.configure).not.toHaveBeenCalled();
    expect(listenerCount()).toBe(0);
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
