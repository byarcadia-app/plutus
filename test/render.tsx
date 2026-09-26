import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";

import { PlutusProvider } from "../src/provider/plutus-provider";
import type { PlutusConfig } from "../src/types";
import { ENTITLEMENT } from "./fixtures";

type ProviderProps = Partial<PlutusConfig>;

/**
 * Renders a hook inside a `PlutusProvider`. The props object is created once, so callbacks keep
 * their identity across re-renders the way a memoizing app passes them.
 */
export function renderInPlutus<Result>(hook: () => Result, props: ProviderProps = {}) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <PlutusProvider apiKey="test_key" entitlementName={ENTITLEMENT} {...props}>
      {children}
    </PlutusProvider>
  );

  return renderHook(hook, { wrapper });
}
