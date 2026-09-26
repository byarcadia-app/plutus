import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

import { resetFakePurchases } from "./fake-purchases";
import { Linking } from "./react-native";

beforeEach(() => {
  resetFakePurchases();
  Linking.openURL.mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
