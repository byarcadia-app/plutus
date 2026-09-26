import { cleanup } from "@testing-library/react";
import Purchases from "react-native-purchases";
import { afterEach, beforeEach, vi } from "vitest";

import { resetFakePurchases } from "./fake-purchases";
import { customerInfo } from "./fixtures";
import { Linking } from "./react-native";

beforeEach(() => {
  resetFakePurchases();
  // A fresh install: RevenueCat knows the person and they own nothing.
  vi.mocked(Purchases.getCustomerInfo).mockResolvedValue(customerInfo());
  Linking.openURL.mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
