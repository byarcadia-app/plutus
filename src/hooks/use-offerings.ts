import { useEffect, useMemo, useState } from "react";
import Purchases, { type PurchasesPackage } from "react-native-purchases";

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
  if (
    !monthlyOffer?.product?.pricePerYear ||
    !annualOffer?.product?.pricePerYear
  ) {
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
  if (
    !rescueOffer?.product?.pricePerYear ||
    !annualOffer?.product?.pricePerYear
  ) {
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

export const useOfferings = (options?: UseOfferingsOptions) => {
  const { isReady, offeringsConfig, onError } = usePlutus();

  const [isLoading, setIsLoading] = useState(false);
  const [monthlyOffer, setMonthlyOffer] = useState<
    PurchasesPackage | undefined
  >();
  const [annualOffer, setAnnualOffer] = useState<
    PurchasesPackage | undefined
  >();
  const [rescueOffer, setRescueOffer] = useState<
    PurchasesPackage | undefined
  >();

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();

      const defaultPackages =
        offerings?.all?.[offeringsConfig.default]?.availablePackages;
      const rescuePackages =
        offerings?.all?.[offeringsConfig.rescue]?.availablePackages;

      setMonthlyOffer(
        defaultPackages?.find(
          (pkg: PurchasesPackage) => pkg.packageType === "MONTHLY",
        ),
      );
      setAnnualOffer(
        defaultPackages?.find(
          (pkg: PurchasesPackage) => pkg.packageType === "ANNUAL",
        ),
      );
      setRescueOffer(
        rescuePackages?.find(
          (pkg: PurchasesPackage) => pkg.packageType === "ANNUAL",
        ),
      );
    } catch (error) {
      onError?.({ code: "OFFERINGS_FAILED", originalError: error });
    }
  };

  useEffect(() => {
    if (isReady) {
      setIsLoading(true);
      loadOfferings().finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, options?.refetchKey]);

  const monthlyHasTrial = useMemo(
    () => hasFreeTrial(monthlyOffer),
    [monthlyOffer],
  );

  const annualHasTrial = useMemo(
    () => hasFreeTrial(annualOffer),
    [annualOffer],
  );

  const annualDiscountPercentage = useMemo(
    () => calculateAnnualDiscount(monthlyOffer, annualOffer),
    [monthlyOffer, annualOffer],
  );

  const rescueOffsetDiscountPercentage = useMemo(
    () => calculateRescueOffsetDiscount(rescueOffer, annualOffer),
    [rescueOffer, annualOffer],
  );

  return {
    isLoading,
    monthlyOffer,
    annualOffer,
    rescueOffer,
    monthlyHasTrial,
    annualHasTrial,
    annualDiscountPercentage,
    rescueOffsetDiscountPercentage,
  };
};
