import { use } from "react";

import { PlutusContext } from "./plutus-provider";

export const usePlutus = () => {
  const context = use(PlutusContext);

  if (!context) {
    throw new Error("usePlutus must be used within a PlutusProvider");
  }

  return context;
};
