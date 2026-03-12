import type { PurchasesPackage } from "react-native-purchases";

export type PlutusErrorCode =
  | "INIT_FAILED"
  | "PURCHASE_FAILED"
  | "OFFERINGS_FAILED"
  | "RESTORE_FAILED";

export class PlutusError extends Error {
  readonly code: PlutusErrorCode;
  override readonly cause?: unknown;
  readonly package?: PurchasesPackage;

  private constructor(
    code: PlutusErrorCode,
    message: string,
    opts?: { cause?: unknown; package?: PurchasesPackage },
  ) {
    super(message);
    this.name = "PlutusError";
    this.code = code;
    this.cause = opts?.cause;
    this.package = opts?.package;
  }

  static initFailed(cause: unknown) {
    return new PlutusError("INIT_FAILED", "Initialization failed", { cause });
  }

  static purchaseFailed(cause: unknown, pack?: PurchasesPackage) {
    return new PlutusError("PURCHASE_FAILED", "Purchase failed", {
      cause,
      package: pack,
    });
  }

  static offeringsFailed(cause: unknown) {
    return new PlutusError("OFFERINGS_FAILED", "Failed to load offerings", {
      cause,
    });
  }

  static restoreFailed(cause: unknown) {
    return new PlutusError("RESTORE_FAILED", "Restore purchases failed", {
      cause,
    });
  }
}
