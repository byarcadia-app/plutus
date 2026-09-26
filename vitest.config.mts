import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      // react-native ships Flow source Node cannot load, and react-native-purchases needs its native
      // module — the tests swap both for stand-ins under `test/`.
      { find: /^react-native$/, replacement: fromRoot("./test/react-native.ts") },
      { find: /^react-native-purchases$/, replacement: fromRoot("./test/fake-purchases.ts") },
    ],
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
  },
});
