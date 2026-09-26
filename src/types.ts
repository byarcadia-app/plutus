import type { CustomerInfo, LOG_LEVEL } from "react-native-purchases";

import type { PlutusError } from "./errors";
import type { PlutusTranslations } from "./translations";

/**
 * Props of `PlutusProvider`.
 *
 * @example
 * const config: PlutusConfig = { apiKey: "appl_…", entitlementName: "Pro" };
 */
export interface PlutusConfig {
  apiKey: string;
  entitlementName: string;
  logLevel?: LOG_LEVEL;
  offerings?: {
    default?: string;
    rescue?: string;
  };
  callbacks?: {
    onError?: (error: PlutusError) => void;
    onCustomerInfoUpdated?: (
      customerInfo: CustomerInfo,
      state: { isPro: boolean; isInTrial: boolean; expirationDate: string | null },
    ) => void;
    onTrackEvent?: (name: string, params?: Record<string, unknown>) => void;
  };
  translations?: Partial<PlutusTranslations>;
}
