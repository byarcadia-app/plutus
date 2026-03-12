import type { PurchasesPackage } from "react-native-purchases";

export type PlutusErrorCode =
  | "INIT_FAILED"
  | "PURCHASE_FAILED"
  | "OFFERINGS_FAILED"
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
  RESTORE_FAILED: (cause: unknown): PlutusError => ({
    code: "RESTORE_FAILED",
    message: "Restore purchases failed",
    cause,
  }),
};
