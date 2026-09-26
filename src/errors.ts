import type { PurchasesPackage } from "react-native-purchases";

export type PlutusErrorCode =
  | "INIT_FAILED"
  | "CUSTOMER_INFO_FAILED"
  | "PURCHASE_FAILED"
  | "OFFERINGS_FAILED"
  | "TRIAL_ELIGIBILITY_FAILED"
  | "RESTORE_FAILED";

export interface PlutusError {
  readonly code: PlutusErrorCode;
  readonly message: string;
  readonly cause?: unknown;
  readonly package?: PurchasesPackage;
}

export const errors = {
  INIT_FAILED: (cause: unknown): PlutusError => ({
    code: "INIT_FAILED",
    message: "Initialization failed",
    cause,
  }),
  CUSTOMER_INFO_FAILED: (cause: unknown): PlutusError => ({
    code: "CUSTOMER_INFO_FAILED",
    message: "Failed to load customer info",
    cause,
  }),
  PURCHASE_FAILED: (cause: unknown, pack?: PurchasesPackage): PlutusError => ({
    code: "PURCHASE_FAILED",
    message: "Purchase failed",
    cause,
    package: pack,
  }),
  OFFERINGS_FAILED: (cause: unknown): PlutusError => ({
    code: "OFFERINGS_FAILED",
    message: "Failed to load offerings",
    cause,
  }),
  TRIAL_ELIGIBILITY_FAILED: (cause: unknown): PlutusError => ({
    code: "TRIAL_ELIGIBILITY_FAILED",
    message: "Failed to check trial eligibility",
    cause,
  }),
  RESTORE_FAILED: (cause: unknown): PlutusError => ({
    code: "RESTORE_FAILED",
    message: "Restore purchases failed",
    cause,
  }),
};
