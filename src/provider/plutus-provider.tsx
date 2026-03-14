import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import Purchases, {
  type CustomerInfo,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
  type PurchasesError,
  type PurchasesPackage,
} from "react-native-purchases";

import { errors, type PlutusError } from "../errors";
import { defaultTranslations } from "../translations";
import type { PlutusConfig } from "../types";

export interface PlutusContextValue {
  isPro: boolean;
  isInTrial: boolean;
  isReady: boolean;
  managementURL: string | null;
  purchasePackage: (pack: PurchasesPackage) => Promise<boolean | undefined>;
  restorePurchases: () => Promise<boolean>;
  translations: typeof defaultTranslations;
  onTrackEvent?: (name: string, params?: Record<string, unknown>) => void;
  onError?: (error: PlutusError) => void;
  offeringsConfig: { default: string; rescue: string };
}

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
      const entitlement = customerInfo?.entitlements.active?.[entitlementName];

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
        await Purchases.setLogLevel(logLevel ?? LOG_LEVEL.ERROR);

        Purchases.configure({ apiKey });

        Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

        setIsReady(true);
      } catch (error) {
        callbacks?.onError?.(errors.INIT_FAILED(error));
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

        return result.customerInfo.entitlements.active?.[entitlementName] !== undefined;
      } catch (error: unknown) {
        const errorCode = (error as PurchasesError)?.code;

        if (errorCode === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          return undefined;
        }

        callbacks?.onError?.(errors.PURCHASE_FAILED(error, pack));

        return undefined;
      }
    },
    [entitlementName, updateCustomerInformation, callbacks],
  );

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      updateCustomerInformation(customerInfo);

      return customerInfo.entitlements.active?.[entitlementName] !== undefined;
    } catch (error) {
      callbacks?.onError?.(errors.RESTORE_FAILED(error));

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

  return <PlutusContext.Provider value={value}>{children}</PlutusContext.Provider>;
};
