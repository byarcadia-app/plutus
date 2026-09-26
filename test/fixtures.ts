import {
  INTRO_ELIGIBILITY_STATUS,
  PACKAGE_TYPE,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";
import type {
  CustomerInfo,
  IntroEligibility,
  MakePurchaseResult,
  PurchasesEntitlementInfo,
  PurchasesError,
  PurchasesIntroPrice,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesStoreProduct,
} from "react-native-purchases";

// react-native-purchases does not re-export its VERIFICATION_RESULT enum; this is the SDK's value.
const NOT_REQUESTED = "NOT_REQUESTED" as PurchasesEntitlementInfo["verification"];

const PURCHASED_AT = "2026-09-01T10:00:00.000Z";
const EXPIRES_AT = "2026-10-01T10:00:00.000Z";

export const ENTITLEMENT = "Pro";

export function entitlement(
  overrides: Partial<PurchasesEntitlementInfo> = {},
): PurchasesEntitlementInfo {
  return {
    identifier: ENTITLEMENT,
    isActive: true,
    willRenew: true,
    periodType: "NORMAL",
    latestPurchaseDate: PURCHASED_AT,
    latestPurchaseDateMillis: Date.parse(PURCHASED_AT),
    originalPurchaseDate: PURCHASED_AT,
    originalPurchaseDateMillis: Date.parse(PURCHASED_AT),
    expirationDate: EXPIRES_AT,
    expirationDateMillis: Date.parse(EXPIRES_AT),
    store: "TEST_STORE",
    productIdentifier: "annual",
    productPlanIdentifier: null,
    isSandbox: true,
    unsubscribeDetectedAt: null,
    unsubscribeDetectedAtMillis: null,
    billingIssueDetectedAt: null,
    billingIssueDetectedAtMillis: null,
    ownershipType: "PURCHASED",
    verification: NOT_REQUESTED,
    ...overrides,
  };
}

export function customerInfo(
  active: PurchasesEntitlementInfo[] = [],
  managementURL: string | null = null,
): CustomerInfo {
  const byIdentifier = Object.fromEntries(active.map((info) => [info.identifier, info]));

  return {
    entitlements: {
      all: byIdentifier,
      active: byIdentifier,
      verification: NOT_REQUESTED,
    },
    activeSubscriptions: active.map((info) => info.productIdentifier),
    allPurchasedProductIdentifiers: active.map((info) => info.productIdentifier),
    latestExpirationDate: active[0]?.expirationDate ?? null,
    firstSeen: PURCHASED_AT,
    originalAppUserId: "$RCAnonymousID:test",
    requestDate: PURCHASED_AT,
    allExpirationDates: {},
    allPurchaseDates: {},
    originalApplicationVersion: null,
    originalPurchaseDate: null,
    managementURL,
    nonSubscriptionTransactions: [],
    subscriptionsByProductIdentifier: {},
  };
}

export const freeWeek: PurchasesIntroPrice = {
  price: 0,
  priceString: "0,00 zł",
  cycles: 1,
  period: "P1W",
  periodUnit: "WEEK",
  periodNumberOfUnits: 1,
};

export const discountedFirstMonth: PurchasesIntroPrice = {
  price: 4.99,
  priceString: "4,99 zł",
  cycles: 1,
  period: "P1M",
  periodUnit: "MONTH",
  periodNumberOfUnits: 1,
};

interface ProductSpec {
  identifier: string;
  price: number;
  pricePerYear: number | null;
  subscriptionPeriod: string;
  introPrice?: PurchasesIntroPrice | null;
}

function storeProduct(spec: ProductSpec, offeringIdentifier: string): PurchasesStoreProduct {
  const priceString = `${spec.price.toFixed(2).replace(".", ",")} zł`;

  return {
    identifier: spec.identifier,
    description: spec.identifier,
    title: spec.identifier,
    price: spec.price,
    priceString,
    pricePerWeek: null,
    pricePerMonth: null,
    pricePerYear: spec.pricePerYear,
    pricePerWeekString: null,
    pricePerMonthString: null,
    pricePerYearString: null,
    currencyCode: "PLN",
    introPrice: spec.introPrice ?? null,
    discounts: null,
    productCategory: PRODUCT_CATEGORY.SUBSCRIPTION,
    productType: PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION,
    subscriptionPeriod: spec.subscriptionPeriod,
    defaultOption: null,
    subscriptionOptions: null,
    presentedOfferingIdentifier: offeringIdentifier,
    presentedOfferingContext: {
      offeringIdentifier,
      placementIdentifier: null,
      targetingContext: null,
    },
  };
}

function purchasesPackage(
  packageType: PACKAGE_TYPE,
  spec: ProductSpec,
  offeringIdentifier: string,
): PurchasesPackage {
  return {
    identifier: `$rc_${packageType.toLowerCase()}`,
    packageType,
    product: storeProduct(spec, offeringIdentifier),
    offeringIdentifier,
    presentedOfferingContext: {
      offeringIdentifier,
      placementIdentifier: null,
      targetingContext: null,
    },
    webCheckoutUrl: null,
  };
}

export function annualPackage(
  introPrice: PurchasesIntroPrice | null = freeWeek,
  offeringIdentifier = "default",
) {
  return purchasesPackage(
    PACKAGE_TYPE.ANNUAL,
    {
      identifier: "annual",
      price: 99.99,
      pricePerYear: 99.99,
      subscriptionPeriod: "P1Y",
      introPrice,
    },
    offeringIdentifier,
  );
}

export function monthlyPackage(
  introPrice: PurchasesIntroPrice | null = null,
  offeringIdentifier = "default",
) {
  return purchasesPackage(
    PACKAGE_TYPE.MONTHLY,
    {
      identifier: "monthly",
      price: 14.99,
      pricePerYear: 179.88,
      subscriptionPeriod: "P1M",
      introPrice,
    },
    offeringIdentifier,
  );
}

export function rescuePackage(offeringIdentifier = "rescue") {
  return purchasesPackage(
    PACKAGE_TYPE.ANNUAL,
    { identifier: "rescue_annual", price: 69.99, pricePerYear: 69.99, subscriptionPeriod: "P1Y" },
    offeringIdentifier,
  );
}

export function offering(identifier: string, packages: PurchasesPackage[]): PurchasesOffering {
  const byType = (type: PACKAGE_TYPE) => packages.find((pkg) => pkg.packageType === type) ?? null;

  return {
    identifier,
    serverDescription: identifier,
    metadata: {},
    availablePackages: packages,
    lifetime: null,
    annual: byType(PACKAGE_TYPE.ANNUAL),
    sixMonth: null,
    threeMonth: null,
    twoMonth: null,
    monthly: byType(PACKAGE_TYPE.MONTHLY),
    weekly: null,
    webCheckoutUrl: null,
  };
}

export function offerings(...list: PurchasesOffering[]): PurchasesOfferings {
  return {
    all: Object.fromEntries(list.map((item) => [item.identifier, item])),
    current: list[0] ?? null,
  };
}

/** The default and rescue offerings a typical app configures. */
export function standardOfferings() {
  return offerings(
    offering("default", [annualPackage(), monthlyPackage()]),
    offering("rescue", [rescuePackage()]),
  );
}

export function purchaseResult(info: CustomerInfo, pkg: PurchasesPackage): MakePurchaseResult {
  return {
    productIdentifier: pkg.product.identifier,
    customerInfo: info,
    transaction: {
      transactionIdentifier: "1000000000000001",
      productIdentifier: pkg.product.identifier,
      purchaseDate: PURCHASED_AT,
      purchaseToken: null,
      originalJson: null,
      signature: null,
    },
  };
}

export function purchasesError(code: PURCHASES_ERROR_CODE): PurchasesError {
  const cancelled = code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;

  return {
    code,
    message: cancelled ? "Purchase was cancelled." : "There was a problem with the App Store.",
    readableErrorCode: cancelled ? "PURCHASE_CANCELLED" : "STORE_PROBLEM",
    userInfo: { readableErrorCode: cancelled ? "PURCHASE_CANCELLED" : "STORE_PROBLEM" },
    underlyingErrorMessage: "",
    userCancelled: cancelled,
  };
}

/** The store's answer for one product, keyed the way the SDK returns it. */
export function eligibility(
  productIdentifier: string,
  status: INTRO_ELIGIBILITY_STATUS,
): Record<string, IntroEligibility> {
  return { [productIdentifier]: { status, description: "" } };
}
