import createClient, { type Middleware } from "openapi-fetch";
import { ApiError } from "./errors";
import type { paths } from "./schema";

// The CSRF token comes in the body of the sign in routes and of GET /api/session. It stays in memory, and a reload reads it again.
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

const readOnly = new Set(["GET", "HEAD", "OPTIONS"]);

async function refreshCsrfToken() {
  const response = await fetch("/api/session", { credentials: "same-origin" });
  if (response.ok) {
    const body = (await response.json().catch(() => null)) as { csrfToken?: string } | null;
    if (typeof body?.csrfToken === "string") csrfToken = body.csrfToken;
  }
}

const middleware: Middleware = {
  onRequest({ request }) {
    if (csrfToken && !readOnly.has(request.method)) request.headers.set("X-CSRF-Token", csrfToken);
    return request;
  },
  async onResponse({ response }) {
    const type = response.headers.get("Content-Type") ?? "";
    if (response.ok && type.includes("application/json")) {
      const body = (await response.clone().json().catch(() => null)) as { csrfToken?: unknown } | null;
      if (typeof body?.csrfToken === "string") csrfToken = body.csrfToken;
    } else if (response.status === 403 && type.includes("application/json")) {
      const body = (await response.clone().json().catch(() => null)) as { error?: { code?: string } } | null;
      // The next write then carries a fresh token
      if (body?.error?.code === "csrf_failed") await refreshCsrfToken();
    }
    return undefined;
  },
};

/** The typed client of the contract. Every path starts with /api on the host of the page, so there is no base URL. */
export const api = createClient<paths>({ baseUrl: "", credentials: "same-origin" });
api.use(middleware);

type Result<T> = { data?: T; error?: unknown; response: Response };

/** Gives the data of an answer, or throws an ApiError for an error answer and for a network failure. */
export async function unwrap<T>(call: Promise<Result<T>>): Promise<T> {
  let result: Result<T>;
  try {
    result = await call;
  } catch (cause) {
    throw new ApiError({
      status: 0,
      code: "network",
      message: cause instanceof Error ? cause.message : "The request failed.",
    });
  }
  if (result.error !== undefined || !result.response.ok) {
    throw ApiError.fromResponse(result.response, result.error);
  }
  return result.data as T;
}
