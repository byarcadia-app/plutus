import { vi } from "vitest";

/** The slice of react-native the hooks touch. */
export const Linking = {
  openURL: vi.fn(async (_url: string) => true),
};
