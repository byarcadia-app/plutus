export interface PlutusTranslations {
  purchaseError: {
    title: string;
    message: string;
  };
  restoreError: {
    title: string;
    message: string;
  };
}

export const defaultTranslations: PlutusTranslations = {
  purchaseError: {
    title: "Purchase Error",
    message: "There was a problem processing your purchase. Please try again.",
  },
  restoreError: {
    title: "Restore Error",
    message:
      "There was a problem restoring your purchases. Please try again.",
  },
};
