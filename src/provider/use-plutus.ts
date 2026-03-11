import { use } from "react";

import type { PlutusContextValue } from "../types";
import { PlutusContext } from "./plutus-provider";

export const usePlutus = (): PlutusContextValue => {
  const context = use(PlutusContext);

  if (!context) {
    throw new Error("usePlutus must be used within a PlutusProvider");
  }

  return context;
};
