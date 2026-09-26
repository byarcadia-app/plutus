import { vi } from "vitest";

/** The slice of react-native the hooks touch. */
export const Linking = {
  openURL: vi.fn(async (_url: string) => true),
};

export const Platform: { OS: "ios" | "android" } = { OS: "ios" };

export function setPlatformOS(os: typeof Platform.OS) {
  Platform.OS = os;
}
