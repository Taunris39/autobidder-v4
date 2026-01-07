// === src/utils/errors.ts ===
// — Custom application error type with optional code.

export class AppError extends Error {
  public code: string | undefined;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}
