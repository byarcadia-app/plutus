import { use } from "react";

import { PlutusContext } from "./plutus-provider";

/**
 * Entitlement state and purchase actions from the nearest `PlutusProvider`.
 *
 * @example
 * const { isPro, isCustomerInfoLoaded, expirationDate } = usePlutus();
 * if (isCustomerInfoLoaded && isPro) {
 *   showProBadge(expirationDate);
 * }
 */
export const usePlutus = () => {
  const context = use(PlutusContext);

  if (!context) {
    throw new Error("usePlutus must be used within a PlutusProvider");
  }

  return context;
};
