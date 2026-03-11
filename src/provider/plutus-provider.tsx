import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
  type PurchasesError,
  type PurchasesPackage,
} from "react-native-purchases";

import { defaultTranslations } from "../translations";
import type { PlutusConfig, PlutusContextValue } from "../types";

export const PlutusContext = createContext<PlutusContextValue | null>(null);

interface PlutusProviderProps extends PlutusConfig {
  children: React.ReactNode;
}

export const PlutusProvider = ({
  children,
  apiKey,
  entitlementName,
  logLevel,
  offerings,
  callbacks,
  translations: translationOverrides,
}: PlutusProviderProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isInTrial, setIsInTrial] = useState(false);
  const [managementURL, setManagementURL] = useState<string | null>(null);

  const translations = useMemo(
    () => ({
      ...defaultTranslations,
      ...translationOverrides,
      purchaseError: {
        ...defaultTranslations.purchaseError,
        ...translationOverrides?.purchaseError,
      },
      restoreError: {
        ...defaultTranslations.restoreError,
        ...translationOverrides?.restoreError,
      },
    }),
    [translationOverrides],
  );

  const offeringsConfig = useMemo(
    () => ({
      default: offerings?.default ?? "default",
      rescue: offerings?.rescue ?? "rescue",
    }),
    [offerings?.default, offerings?.rescue],
  );

  const updateCustomerInformation = useCallback(
    (customerInfo: CustomerInfo) => {
      const entitlement =
        customerInfo?.entitlements.active?.[entitlementName];

      const newIsPro = entitlement !== undefined;
      const newIsInTrial = entitlement?.periodType === "TRIAL";

      setIsPro(newIsPro);
      setIsInTrial(newIsInTrial);
      setManagementURL(customerInfo.managementURL);

      callbacks?.onCustomerInfoUpdated?.(customerInfo, {
        isPro: newIsPro,
        isInTrial: newIsInTrial,
      });
    },
    [entitlementName, callbacks],
  );

  useEffect(() => {
    const customerInfoUpdateListener = (info: CustomerInfo) => {
      updateCustomerInformation(info);
    };

    const init = async () => {
      try {
        const resolvedKey =
          typeof apiKey === "string"
            ? apiKey
            : Platform.OS === "ios"
              ? apiKey.apple
              : apiKey.google;

        if (!resolvedKey) {
          throw new Error(
            `No API key provided for platform: ${Platform.OS}`,
          );
        }

        Purchases.configure({ apiKey: resolvedKey });

        await Purchases.setLogLevel(logLevel ?? LOG_LEVEL.ERROR);

        Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

        setIsReady(true);
      } catch (error) {
        callbacks?.onError?.({
          code: "INIT_FAILED",
          originalError: error,
        });
      }
    };

    init();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateListener);
    };
  }, [apiKey, logLevel, updateCustomerInformation, callbacks]);

  const purchasePackage = useCallback(
    async (pack: PurchasesPackage): Promise<boolean | undefined> => {
      try {
        const result = await Purchases.purchasePackage(pack);
        updateCustomerInformation(result.customerInfo);

        return (
          result.customerInfo.entitlements.active?.[entitlementName] !==
          undefined
        );
      } catch (error: unknown) {
        const errorCode = (error as PurchasesError)?.code;

        if (errorCode === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          return undefined;
        }

        callbacks?.onError?.({
          code: "PURCHASE_FAILED",
          originalError: error,
          package: pack,
        });

        return undefined;
      }
    },
    [entitlementName, updateCustomerInformation, callbacks],
  );

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      updateCustomerInformation(customerInfo);

      return (
        customerInfo.entitlements.active?.[entitlementName] !== undefined
      );
    } catch (error) {
      callbacks?.onError?.({
        code: "RESTORE_FAILED",
        originalError: error,
      });

      return false;
    }
  }, [entitlementName, updateCustomerInformation, callbacks]);

  const value = useMemo<PlutusContextValue>(
    () => ({
      isPro,
      isInTrial,
      isReady,
      managementURL,
      purchasePackage,
      restorePurchases,
      translations,
      onTrackEvent: callbacks?.onTrackEvent,
      onError: callbacks?.onError,
      offeringsConfig,
    }),
    [
      isPro,
      isInTrial,
      isReady,
      managementURL,
      purchasePackage,
      restorePurchases,
      translations,
      callbacks?.onTrackEvent,
      callbacks?.onError,
      offeringsConfig,
    ],
  );

  return (
    <PlutusContext.Provider value={value}>{children}</PlutusContext.Provider>
  );
};
