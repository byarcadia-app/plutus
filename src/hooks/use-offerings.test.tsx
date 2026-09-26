import { act, waitFor } from "@testing-library/react";
import Purchases from "react-native-purchases";
import type { PurchasesOfferings } from "react-native-purchases";
import { describe, expect, it, vi } from "vitest";

import { deferred } from "../../test/deferred";
import {
  annualPackage,
  discountedFirstMonth,
  monthlyPackage,
  offering,
  offerings,
  rescuePackage,
  standardOfferings,
} from "../../test/fixtures";
import { renderInPlutus, type ProviderProps } from "../../test/render";
import { useOfferings } from "./use-offerings";

async function renderLoaded(props: ProviderProps = {}) {
  const rendered = renderInPlutus(() => useOfferings(), props);
  await waitFor(() => expect(rendered.result.current.annualOffer).toBeDefined());

  return rendered;
}

describe("useOfferings", () => {
  it("resolves monthly and annual from the default offering, and annual from the rescue offering", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(standardOfferings());

    const { result } = await renderLoaded();

    expect(result.current.annualOffer?.product.identifier).toBe("annual");
    expect(result.current.monthlyOffer?.product.identifier).toBe("monthly");
    expect(result.current.rescueOffer?.product.identifier).toBe("rescue_annual");
  });

  it("reads the offering identifiers the provider is given", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(
      offerings(
        offering("premium", [annualPackage(undefined, "premium"), monthlyPackage(null, "premium")]),
        offering("win-back", [rescuePackage("win-back")]),
      ),
    );

    const { result } = await renderLoaded({
      offerings: { default: "premium", rescue: "win-back" },
    });

    expect(result.current.monthlyOffer?.offeringIdentifier).toBe("premium");
    expect(result.current.rescueOffer?.offeringIdentifier).toBe("win-back");
  });

  it("leaves an offer undefined when its package is missing", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(
      offerings(offering("default", [annualPackage()])),
    );

    const { result } = await renderLoaded();

    expect(result.current.monthlyOffer).toBeUndefined();
    expect(result.current.rescueOffer).toBeUndefined();
  });

  it("0.1.1 behaviour — changes in 0.2.0 on iOS: a free intro price alone means a trial", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(standardOfferings());

    const { result } = await renderLoaded();

    expect(result.current.annualHasTrial).toBe(true);
    expect(result.current.monthlyHasTrial).toBe(false);
    expect(Purchases.checkTrialOrIntroductoryPriceEligibility).not.toHaveBeenCalled();
  });

  it("does not count a paid intro price as a trial", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(
      offerings(offering("default", [annualPackage(discountedFirstMonth), monthlyPackage()])),
    );

    const { result } = await renderLoaded();

    expect(result.current.annualHasTrial).toBe(false);
  });

  it("computes the annual and rescue savings, floored", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(standardOfferings());

    const { result } = await renderLoaded();

    // 12 × 14,99 = 179,88 against 99,99; and 69,99 against 99,99.
    expect(result.current.annualDiscountPercentage).toBe(44);
    expect(result.current.rescueOffsetDiscountPercentage).toBe(30);
  });

  it("has no discount without the offer to compare against", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(
      offerings(offering("default", [annualPackage()])),
    );

    const { result } = await renderLoaded();

    expect(result.current.annualDiscountPercentage).toBeUndefined();
    expect(result.current.rescueOffsetDiscountPercentage).toBeUndefined();
  });

  it("reads as loading from the first frame until the offers arrive", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(standardOfferings());

    const { result } = renderInPlutus(() => useOfferings());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.annualOffer).toBeUndefined();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.annualOffer).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  it("stops loading and hands over the init error when the SDK never started", async () => {
    const { result } = renderInPlutus(() => useOfferings(), { apiKey: "" });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toMatchObject({ code: "INIT_FAILED" });
    expect(Purchases.getOfferings).not.toHaveBeenCalled();
  });

  it("fetches again on refetch and clears the error once it succeeds", async () => {
    vi.mocked(Purchases.getOfferings)
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(standardOfferings());

    const { result } = renderInPlutus(() => useOfferings());
    await waitFor(() => expect(result.current.error).toMatchObject({ code: "OFFERINGS_FAILED" }));

    act(() => result.current.refetch());

    await waitFor(() => expect(result.current.annualOffer).toBeDefined());
    expect(result.current.error).toBeNull();
    expect(Purchases.getOfferings).toHaveBeenCalledTimes(2);
  });

  it("ignores a fetch that settles after a newer one", async () => {
    const stale = deferred<PurchasesOfferings>();
    vi.mocked(Purchases.getOfferings)
      .mockReturnValueOnce(stale.promise)
      .mockResolvedValueOnce(standardOfferings());
    let refetchKey = 1;

    const { rerender, result } = renderInPlutus(() => useOfferings({ refetchKey }));
    await waitFor(() => expect(Purchases.getOfferings).toHaveBeenCalledOnce());
    refetchKey = 2;
    rerender();
    await waitFor(() => expect(result.current.monthlyOffer).toBeDefined());

    await act(async () => stale.resolve(offerings(offering("default", [annualPackage()]))));

    expect(result.current.monthlyOffer).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("is loading while the fetch is in flight and settles after it", async () => {
    const fetch = deferred<PurchasesOfferings>();
    vi.mocked(Purchases.getOfferings).mockReturnValue(fetch.promise);

    const { result } = renderInPlutus(() => useOfferings());
    await waitFor(() => expect(result.current.isLoading).toBe(true));

    fetch.resolve(standardOfferings());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.annualOffer).toBeDefined();
  });

  it("reports OFFERINGS_FAILED and leaves the offers undefined when the fetch fails", async () => {
    const onError = vi.fn();
    vi.mocked(Purchases.getOfferings).mockRejectedValue(new Error("network"));

    const { result } = renderInPlutus(() => useOfferings(), { callbacks: { onError } });

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "OFFERINGS_FAILED" })),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.annualOffer).toBeUndefined();
    expect(result.current.error).toMatchObject({ code: "OFFERINGS_FAILED" });
  });

  it("fetches again when the refetch key changes", async () => {
    vi.mocked(Purchases.getOfferings).mockResolvedValue(standardOfferings());
    let refetchKey = "2026-09-26";

    const { rerender, result } = renderInPlutus(() => useOfferings({ refetchKey }));
    await waitFor(() => expect(result.current.annualOffer).toBeDefined());

    refetchKey = "2026-09-27";
    rerender();

    await waitFor(() => expect(Purchases.getOfferings).toHaveBeenCalledTimes(2));
  });
});
