export interface ValidationErrorDetail {
  field: string;
  message: string;
  reason?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;
  readonly code?: number;
  readonly requestId?: string;
  readonly validationErrors?: ValidationErrorDetail[];

  constructor(
    message: string,
    status = 400,
    details?: unknown,
    options?: { code?: number; requestId?: string },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.code = options?.code;
    this.requestId = options?.requestId;
    this.validationErrors = this.extractValidationErrors(details);
  }

  getDetailedMessage(): string {
    const validationErrors =
      (this.validationErrors?.length ?? 0)
        ? this.validationErrors
        : this.extractValidationErrors(this.details);

    if (validationErrors && validationErrors.length) {
      const formatted = validationErrors
        .map((v) => `${v.field}: ${v.reason ?? v.message}`)
        .join("; ");
      return `${this.message}. Validation errors: ${formatted}`;
    }

    return this.message;
  }

  isValidationError(): boolean {
    return this.status === 422 || (this.validationErrors?.length ?? 0) > 0;
  }

  isNotFoundError(): boolean {
    return this.status === 404;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      requestId: this.requestId,
      validationErrors: this.validationErrors,
      details: this.details,
    };
  }

  private extractValidationErrors(details: unknown): ValidationErrorDetail[] {
    if (Array.isArray(details)) {
      return details.filter(
        (d): d is ValidationErrorDetail =>
          typeof d === "object" && !!d && "field" in d && "message" in d,
      );
    }

    const validationErrors =
      typeof details === "object" &&
      details !== null &&
      "error" in (details as Record<string, unknown>) &&
      typeof (details as { error?: { details?: unknown } }).error ===
        "object" &&
      (details as { error?: { details?: unknown } }).error?.details &&
      typeof (
        details as {
          error?: { details?: { validation_errors?: ValidationErrorDetail[] } };
        }
      ).error?.details === "object"
        ? (
            details as {
              error?: {
                details?: { validation_errors?: ValidationErrorDetail[] };
              };
            }
          ).error?.details?.validation_errors
        : undefined;

    return validationErrors ?? [];
  }
}
