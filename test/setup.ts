import { cleanup } from "@testing-library/react";
import Purchases from "react-native-purchases";
import { afterEach, beforeEach, vi } from "vitest";

import { resetFakePurchases } from "./fake-purchases";
import { customerInfo } from "./fixtures";
import { Linking, setPlatformOS } from "./react-native";

beforeEach(() => {
  resetFakePurchases();
  // A fresh install on iOS: RevenueCat knows the person, they own nothing, and the store has no
  // eligibility answer for any product.
  vi.mocked(Purchases.getCustomerInfo).mockResolvedValue(customerInfo());
  vi.mocked(Purchases.checkTrialOrIntroductoryPriceEligibility).mockResolvedValue({});
  setPlatformOS("ios");
  Linking.openURL.mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
