import type { components } from "./schema";

export type ApiErrorBody = components["schemas"]["ErrorBody"];
export type ApiErrorCode = components["schemas"]["ErrorCode"];
export type ApiErrorDetail = components["schemas"]["ErrorDetail"];

/** An error answer of the API. A screen branches on `code` and never on `message`. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode | "network" | "unknown";
  readonly details: ApiErrorDetail[];
  readonly requestId: string | undefined;
  /** Seconds to wait, from the header `Retry-After` of a 429 answer. */
  readonly retryAfter: number | undefined;

  constructor(init: {
    status: number;
    code: ApiError["code"];
    message: string;
    details?: ApiErrorDetail[];
    requestId?: string;
    retryAfter?: number;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.details = init.details ?? [];
    this.requestId = init.requestId;
    this.retryAfter = init.retryAfter;
  }

  static fromResponse(response: Response, body: unknown) {
    const error = (body as { error?: Partial<ApiErrorBody> } | undefined)?.error;
    const retry = Number(response.headers.get("Retry-After"));
    return new ApiError({
      status: response.status,
      code: error?.code ?? "unknown",
      message: error?.message ?? response.statusText,
      details: error?.details,
      requestId: error?.requestId ?? response.headers.get("X-Request-Id") ?? undefined,
      retryAfter: Number.isFinite(retry) && retry > 0 ? retry : undefined,
    });
  }

  /** The detail of one field, for example `items[0].qty` or `serial`. */
  detail(field: string) {
    return this.details.find((d) => d.field === field);
  }
}
