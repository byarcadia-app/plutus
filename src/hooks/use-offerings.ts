import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import Purchases, { INTRO_ELIGIBILITY_STATUS, type PurchasesPackage } from "react-native-purchases";

import { errors, type PlutusError } from "../errors";
import { usePlutus } from "../provider/use-plutus";

interface UseOfferingsOptions {
  refetchKey?: string | number;
}

const hasFreeIntroPrice = (offer?: PurchasesPackage): offer is PurchasesPackage =>
  offer?.product?.introPrice?.price === 0;

/**
 * The product identifiers whose free trial this person can still get. On iOS only the store knows
 * whether an intro offer was used; the SDK answers UNKNOWN elsewhere, so a free intro price decides.
 */
const findTrials = async (
  offers: (PurchasesPackage | undefined)[],
  onError?: (error: PlutusError) => void,
): Promise<Set<string>> => {
  const identifiers = offers.filter(hasFreeIntroPrice).map((offer) => offer.product.identifier);

  if (Platform.OS !== "ios" || identifiers.length === 0) {
    return new Set(identifiers);
  }

  try {
    const eligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility(identifiers);

    return new Set(
      identifiers.filter(
        (identifier) =>
          eligibility[identifier]?.status ===
          INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE,
      ),
    );
  } catch (cause) {
    onError?.(errors.TRIAL_ELIGIBILITY_FAILED(cause));

    return new Set();
  }
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
  monthlyHasTrial: boolean;
  annualHasTrial: boolean;
}

const NO_OFFERS: Offers = { monthlyHasTrial: false, annualHasTrial: false };

/**
 * The default and rescue offerings, whether this person can still get each free trial, and the
 * savings between plans. Loading from the first render until everything has arrived.
 *
 * @example
 * const { isLoading, error, refetch, annualOffer, annualHasTrial } = useOfferings();
 * if (isLoading) return <Spinner />;
 * if (error) return <Retry onPress={refetch} />;
 */
export const useOfferings = (options?: UseOfferingsOptions) => {
  const { isReady, initError, offeringsConfig, onError } = usePlutus();

  const [{ monthlyOffer, annualOffer, rescueOffer, monthlyHasTrial, annualHasTrial }, setOffers] =
    useState<Offers>(NO_OFFERS);
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

        const monthly = defaultPackages?.find((pkg) => pkg.packageType === "MONTHLY");
        const annual = defaultPackages?.find((pkg) => pkg.packageType === "ANNUAL");
        const trials = await findTrials([monthly, annual], onError);

        if (!isCurrent) {
          return;
        }

        setOffers({
          monthlyOffer: monthly,
          annualOffer: annual,
          rescueOffer: rescuePackages?.find((pkg) => pkg.packageType === "ANNUAL"),
          monthlyHasTrial: monthly !== undefined && trials.has(monthly.product.identifier),
          annualHasTrial: annual !== undefined && trials.has(annual.product.identifier),
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
