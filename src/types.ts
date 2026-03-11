import type {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesPackage,
} from "react-native-purchases";

import type { PlutusTranslations } from "./translations";

// ─── Error types ───

export type PlutusErrorCode =
  | "INIT_FAILED"
  | "PURCHASE_FAILED"
  | "OFFERINGS_FAILED"
  | "RESTORE_FAILED";

export interface PlutusError {
  code: PlutusErrorCode;
  originalError: unknown;
  package?: PurchasesPackage;
}

// ─── Config ───

export interface PlutusCallbacks {
  onError?: (error: PlutusError) => void;
  onCustomerInfoUpdated?: (
    customerInfo: CustomerInfo,
    state: { isPro: boolean; isInTrial: boolean },
  ) => void;
  onTrackEvent?: (name: string, params?: Record<string, unknown>) => void;
}

export interface PlutusOfferingsConfig {
  default?: string;
  rescue?: string;
}

export interface PlutusConfig {
  apiKey: string | { apple?: string; google?: string };
  entitlementName: string;
  logLevel?: LOG_LEVEL;
  offerings?: PlutusOfferingsConfig;
  callbacks?: PlutusCallbacks;
  translations?: Partial<PlutusTranslations>;
}

// ─── Provider context ───

export interface PlutusContextValue {
  isPro: boolean;
  isInTrial: boolean;
  isReady: boolean;
  managementURL: string | null;
  purchasePackage: (pack: PurchasesPackage) => Promise<boolean | undefined>;
  restorePurchases: () => Promise<boolean>;
  translations: PlutusTranslations;
  onTrackEvent?: (name: string, params?: Record<string, unknown>) => void;
  onError?: (error: PlutusError) => void;
  offeringsConfig: Required<PlutusOfferingsConfig>;
}

// ─── Paywall hook options ───

interface BasePaywallCallbacks {
  onClose?: () => void;
  onPurchaseFailed?: () => void;
  onRestoreSuccess?: () => void;
  onRestoreFailed?: () => void;
  onTrackEvent?: (name: string, params?: Record<string, unknown>) => void;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface UsePaywallOptions extends BasePaywallCallbacks {
  monthlyOffer?: PurchasesPackage;
  annualOffer?: PurchasesPackage;
  onPurchaseSuccess?: (subscriptionType: "monthly" | "annual") => void;
}

export interface UseRescuePaywallOptions extends BasePaywallCallbacks {
  rescueOffer?: PurchasesPackage;
  onPurchaseSuccess?: () => void;
}
