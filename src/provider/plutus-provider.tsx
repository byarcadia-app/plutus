import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Purchases, {
  type CustomerInfo,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
  type PurchasesPackage,
} from "react-native-purchases";

import { errors, type PlutusError } from "../errors";
import { defaultTranslations } from "../translations";
import type { PlutusConfig } from "../types";

const isCancellation = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;

export interface PlutusContextValue {
  isPro: boolean;
  isInTrial: boolean;
  isReady: boolean;
  isCustomerInfoLoaded: boolean;
  expirationDate: string | null;
  initError: PlutusError | null;
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
  const [isCustomerInfoLoaded, setIsCustomerInfoLoaded] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [initError, setInitError] = useState<PlutusError | null>(null);
  const [managementURL, setManagementURL] = useState<string | null>(null);

  // Bumped on every customer info applied, so the start-up read can tell it was overtaken.
  const customerInfoVersion = useRef(0);

  // The SDK listener and the actions read these through a ref, so a new callbacks object or
  // entitlement name never re-configures RevenueCat.
  const latest = useRef({ entitlementName, callbacks });
  useLayoutEffect(() => {
    latest.current = { entitlementName, callbacks };
  });

  // Forwards the arguments as given: an event without params still arrives with one argument.
  const onTrackEvent = useCallback((...event: [name: string, params?: Record<string, unknown>]) => {
    latest.current.callbacks?.onTrackEvent?.(...event);
  }, []);

  const onError = useCallback((error: PlutusError) => {
    latest.current.callbacks?.onError?.(error);
  }, []);

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

  const updateCustomerInformation = useCallback((customerInfo: CustomerInfo) => {
    const entitlement = customerInfo?.entitlements.active?.[latest.current.entitlementName];

    const newIsPro = entitlement !== undefined;
    const newIsInTrial = entitlement?.periodType === "TRIAL";
    const newExpirationDate = entitlement?.expirationDate ?? null;

    customerInfoVersion.current += 1;
    setIsPro(newIsPro);
    setIsInTrial(newIsInTrial);
    setExpirationDate(newExpirationDate);
    setIsCustomerInfoLoaded(true);
    setManagementURL(customerInfo.managementURL);

    latest.current.callbacks?.onCustomerInfoUpdated?.(customerInfo, {
      isPro: newIsPro,
      isInTrial: newIsInTrial,
      expirationDate: newExpirationDate,
    });
  }, []);

  useEffect(() => {
    let isActive = true;

    const customerInfoUpdateListener = (info: CustomerInfo) => {
      updateCustomerInformation(info);
    };

    const failInit = (error: PlutusError) => {
      setInitError(error);
      onError(error);
    };

    const init = async () => {
      if (!apiKey || !apiKey.trim()) {
        failInit(
          errors.INIT_FAILED(new Error("Plutus: apiKey must not be empty. SDK not initialized.")),
        );
        return;
      }

      try {
        await Purchases.setLogLevel(logLevel ?? LOG_LEVEL.ERROR);

        // Unmounted while the log level was set: a later run owns the SDK.
        if (!isActive) {
          return;
        }

        Purchases.configure({ apiKey });

        Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

        setInitError(null);
        setIsReady(true);
      } catch (error) {
        failInit(errors.INIT_FAILED(error));
        return;
      }

      const version = customerInfoVersion.current;

      try {
        const customerInfo = await Purchases.getCustomerInfo();

        if (isActive && customerInfoVersion.current === version) {
          updateCustomerInformation(customerInfo);
        }
      } catch (error) {
        if (isActive) {
          onError(errors.CUSTOMER_INFO_FAILED(error));
        }
      }
    };

    init();

    return () => {
      isActive = false;
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateListener);
    };
  }, [apiKey, logLevel, updateCustomerInformation, onError]);

  const purchasePackage = useCallback(
    async (pack: PurchasesPackage): Promise<boolean | undefined> => {
      try {
        const result = await Purchases.purchasePackage(pack);
        updateCustomerInformation(result.customerInfo);

        return (
          result.customerInfo.entitlements.active?.[latest.current.entitlementName] !== undefined
        );
      } catch (error: unknown) {
        // `undefined` is reserved for a cancel, so callers can tell it from a failure.
        if (isCancellation(error)) {
          return undefined;
        }

        onError(errors.PURCHASE_FAILED(error, pack));

        return false;
      }
    },
    [updateCustomerInformation, onError],
  );

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      updateCustomerInformation(customerInfo);

      return customerInfo.entitlements.active?.[latest.current.entitlementName] !== undefined;
    } catch (error) {
      onError(errors.RESTORE_FAILED(error));

      return false;
    }
  }, [updateCustomerInformation, onError]);

  const value = useMemo<PlutusContextValue>(
    () => ({
      isPro,
      isInTrial,
      isReady,
      isCustomerInfoLoaded,
      expirationDate,
      initError,
      managementURL,
      purchasePackage,
      restorePurchases,
      translations,
      onTrackEvent,
      onError,
      offeringsConfig,
    }),
    [
      isPro,
      isInTrial,
      isReady,
      isCustomerInfoLoaded,
      expirationDate,
      initError,
      managementURL,
      purchasePackage,
      restorePurchases,
      translations,
      onTrackEvent,
      onError,
      offeringsConfig,
    ],
  );

  return <PlutusContext.Provider value={value}>{children}</PlutusContext.Provider>;
};
