import { describe, expect, it } from "vitest";
import { ApiError } from "./errors";

function answer(status: number, headers: Record<string, string> = {}) {
  return new Response(null, { status, headers });
}

describe("ApiError.fromResponse", () => {
  it("reads the code, the message, the details and the request id of the error body", () => {
    const body = {
      error: {
        code: "validation_failed",
        message: "A field is wrong.",
        requestId: "req-1",
        details: [{ field: "items[0].qty", code: "out_of_range", message: "Too many." }],
      },
    };
    const error = ApiError.fromResponse(answer(422), body);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.code).toBe("validation_failed");
    expect(error.message).toBe("A field is wrong.");
    expect(error.requestId).toBe("req-1");
    expect(error.detail("items[0].qty")?.code).toBe("out_of_range");
    expect(error.detail("serial")).toBeUndefined();
  });

  it("falls back to the code unknown and the status text for a body that is not the error body", () => {
    const error = ApiError.fromResponse(new Response("<html>", { status: 502, statusText: "Bad Gateway" }), "<html>");
    expect(error.code).toBe("unknown");
    expect(error.message).toBe("Bad Gateway");
    expect(error.details).toEqual([]);
  });

  it("names the status when the message and the status text are both empty", () => {
    const error = ApiError.fromResponse(answer(503), undefined);
    expect(error.message).toBe("HTTP 503");
  });

  it("takes the request id of the header when the body has none", () => {
    const error = ApiError.fromResponse(answer(500, { "X-Request-Id": "req-2" }), { error: { code: "internal", message: "x" } });
    expect(error.requestId).toBe("req-2");
  });

  it("ignores details that are not a list and drops entries without a field and a code", () => {
    const notAList = ApiError.fromResponse(answer(422), { error: { code: "validation_failed", message: "x", details: {} } });
    expect(notAList.details).toEqual([]);
    expect(() => notAList.detail("serial")).not.toThrow();

    const mixed = ApiError.fromResponse(answer(422), {
      error: {
        code: "duplicate",
        message: "x",
        details: [{ field: "serial", code: "duplicate", message: "Taken." }, { field: "name" }, null, "text"],
      },
    });
    expect(mixed.details).toHaveLength(1);
    expect(mixed.detail("serial")?.message).toBe("Taken.");
  });

  it("reads Retry-After as seconds and ignores a value that is not a positive number", () => {
    const body = { error: { code: "rate_limited", message: "x" } };
    expect(ApiError.fromResponse(answer(429, { "Retry-After": "7" }), body).retryAfter).toBe(7);
    expect(ApiError.fromResponse(answer(429, { "Retry-After": "soon" }), body).retryAfter).toBeUndefined();
    expect(ApiError.fromResponse(answer(429, { "Retry-After": "0" }), body).retryAfter).toBeUndefined();
    expect(ApiError.fromResponse(answer(429), body).retryAfter).toBeUndefined();
  });
});
