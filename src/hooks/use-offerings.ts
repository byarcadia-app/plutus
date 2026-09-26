import { useCallback, useEffect, useMemo, useState } from "react";
import Purchases, { type PurchasesPackage } from "react-native-purchases";

import { errors, type PlutusError } from "../errors";
import { usePlutus } from "../provider/use-plutus";

interface UseOfferingsOptions {
  refetchKey?: string | number;
}

const hasFreeTrial = (offer?: PurchasesPackage): boolean => {
  if (!offer?.product?.introPrice) return false;
  return offer.product.introPrice.price === 0;
};

const calculateAnnualDiscount = (
  monthlyOffer?: PurchasesPackage,
  annualOffer?: PurchasesPackage,
): number | undefined => {
  if (!monthlyOffer?.product?.pricePerYear || !annualOffer?.product?.pricePerYear) {
    return undefined;
  }

  const monthlyPricePerYear = monthlyOffer.product.pricePerYear;
  const annualPricePerYear = annualOffer.product.pricePerYear;

  if (monthlyPricePerYear <= annualPricePerYear) {
    return undefined;
  }

  const savingsAmount = monthlyPricePerYear - annualPricePerYear;
  const discountPercentage = (savingsAmount / monthlyPricePerYear) * 100;

  return Math.floor(discountPercentage);
};

const calculateRescueOffsetDiscount = (
  rescueOffer?: PurchasesPackage,
  annualOffer?: PurchasesPackage,
): number | undefined => {
  if (!rescueOffer?.product?.pricePerYear || !annualOffer?.product?.pricePerYear) {
    return undefined;
  }

  const rescuePricePerYear = rescueOffer.product.pricePerYear;
  const annualPricePerYear = annualOffer.product.pricePerYear;

  if (rescuePricePerYear >= annualPricePerYear) {
    return undefined;
  }

  const savingsAmount = annualPricePerYear - rescuePricePerYear;
  const discountPercentage = (savingsAmount / annualPricePerYear) * 100;

  return Math.floor(discountPercentage);
};

interface Offers {
  monthlyOffer?: PurchasesPackage;
  annualOffer?: PurchasesPackage;
  rescueOffer?: PurchasesPackage;
}

export const useOfferings = (options?: UseOfferingsOptions) => {
  const { isReady, initError, offeringsConfig, onError } = usePlutus();

  const [{ monthlyOffer, annualOffer, rescueOffer }, setOffers] = useState<Offers>({});
  // Starts true: until the SDK is ready and the first fetch settles, there is nothing to show yet.
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<PlutusError | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isCurrent = true;
    setIsFetching(true);

    const loadOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();

        if (!isCurrent) {
          return;
        }

        const defaultPackages = offerings?.all?.[offeringsConfig.default]?.availablePackages;
        const rescuePackages = offerings?.all?.[offeringsConfig.rescue]?.availablePackages;

        setOffers({
          monthlyOffer: defaultPackages?.find((pkg) => pkg.packageType === "MONTHLY"),
          annualOffer: defaultPackages?.find((pkg) => pkg.packageType === "ANNUAL"),
          rescueOffer: rescuePackages?.find((pkg) => pkg.packageType === "ANNUAL"),
        });
        setError(null);
      } catch (cause) {
        const failure = errors.OFFERINGS_FAILED(cause);
        onError?.(failure);

        if (isCurrent) {
          setError(failure);
        }
      } finally {
        if (isCurrent) {
          setIsFetching(false);
        }
      }
    };

    loadOfferings();

    return () => {
      isCurrent = false;
    };
  }, [isReady, offeringsConfig, onError, options?.refetchKey, attempt]);

  const refetch = useCallback(() => setAttempt((count) => count + 1), []);

  const monthlyHasTrial = useMemo(() => hasFreeTrial(monthlyOffer), [monthlyOffer]);

  const annualHasTrial = useMemo(() => hasFreeTrial(annualOffer), [annualOffer]);

  const annualDiscountPercentage = useMemo(
    () => calculateAnnualDiscount(monthlyOffer, annualOffer),
    [monthlyOffer, annualOffer],
  );

  const rescueOffsetDiscountPercentage = useMemo(
    () => calculateRescueOffsetDiscount(rescueOffer, annualOffer),
    [rescueOffer, annualOffer],
  );

  return {
    // A provider that failed to start never becomes ready, so it must not leave the caller waiting.
    isLoading: initError ? false : isFetching,
    error: initError ?? error,
    refetch,
    monthlyOffer,
    annualOffer,
    rescueOffer,
    monthlyHasTrial,
    annualHasTrial,
    annualDiscountPercentage,
    rescueOffsetDiscountPercentage,
  };
};
