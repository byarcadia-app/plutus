import type RealPurchases from "react-native-purchases";
import type { CustomerInfoUpdateListener, CustomerInfo } from "react-native-purchases";
import { vi } from "vitest";

// The SDK's enums, with the values react-native-purchases 9 and 10 ship. Only the members the
// source and the tests read are listed.
export const LOG_LEVEL = {
  VERBOSE: "VERBOSE",
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
} as const;

export const PURCHASES_ERROR_CODE = {
  PURCHASE_CANCELLED_ERROR: "1",
  STORE_PROBLEM_ERROR: "2",
} as const;

export const INTRO_ELIGIBILITY_STATUS = {
  INTRO_ELIGIBILITY_STATUS_UNKNOWN: 0,
  INTRO_ELIGIBILITY_STATUS_INELIGIBLE: 1,
  INTRO_ELIGIBILITY_STATUS_ELIGIBLE: 2,
  INTRO_ELIGIBILITY_STATUS_NO_INTRO_OFFER_EXISTS: 3,
} as const;

export const PACKAGE_TYPE = {
  ANNUAL: "ANNUAL",
  MONTHLY: "MONTHLY",
} as const;

export const PRODUCT_CATEGORY = { SUBSCRIPTION: "SUBSCRIPTION" } as const;

export const PRODUCT_TYPE = { AUTO_RENEWABLE_SUBSCRIPTION: "AUTO_RENEWABLE_SUBSCRIPTION" } as const;

const listeners = new Set<CustomerInfoUpdateListener>();

const notStubbed = (name: string) => () => Promise.reject(new Error(`${name} is not stubbed`));

const Purchases = {
  configure: vi.fn<typeof RealPurchases.configure>(),
  setLogLevel: vi.fn<typeof RealPurchases.setLogLevel>(),
  addCustomerInfoUpdateListener: vi.fn<typeof RealPurchases.addCustomerInfoUpdateListener>(),
  removeCustomerInfoUpdateListener: vi.fn<typeof RealPurchases.removeCustomerInfoUpdateListener>(),
  getCustomerInfo: vi.fn<typeof RealPurchases.getCustomerInfo>(),
  getOfferings: vi.fn<typeof RealPurchases.getOfferings>(),
  purchasePackage: vi.fn<typeof RealPurchases.purchasePackage>(),
  restorePurchases: vi.fn<typeof RealPurchases.restorePurchases>(),
  checkTrialOrIntroductoryPriceEligibility:
    vi.fn<typeof RealPurchases.checkTrialOrIntroductoryPriceEligibility>(),
};

export default Purchases;

/** Back to a configured-but-empty SDK: any call a test did not stub rejects loudly. */
export function resetFakePurchases() {
  listeners.clear();

  Purchases.configure.mockReset();
  Purchases.setLogLevel.mockReset().mockResolvedValue(undefined);
  Purchases.addCustomerInfoUpdateListener.mockReset().mockImplementation((listener) => {
    listeners.add(listener);
  });
  Purchases.removeCustomerInfoUpdateListener
    .mockReset()
    .mockImplementation((listener) => listeners.delete(listener));
  Purchases.getCustomerInfo.mockReset().mockImplementation(notStubbed("getCustomerInfo"));
  Purchases.getOfferings.mockReset().mockImplementation(notStubbed("getOfferings"));
  Purchases.purchasePackage.mockReset().mockImplementation(notStubbed("purchasePackage"));
  Purchases.restorePurchases.mockReset().mockImplementation(notStubbed("restorePurchases"));
  Purchases.checkTrialOrIntroductoryPriceEligibility
    .mockReset()
    .mockImplementation(notStubbed("checkTrialOrIntroductoryPriceEligibility"));
}

/** What the native SDK does when RevenueCat reports new customer info. */
export function emitCustomerInfo(customerInfo: CustomerInfo) {
  for (const listener of listeners) {
    listener(customerInfo);
  }
}

export function listenerCount() {
  return listeners.size;
}
