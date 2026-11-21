import { beforeEach, describe, expect, it } from "vitest";
import { ApiError } from "./errors";
import { createApiClient, setCsrfToken, unwrap } from "./client";

const session = (token: string) => ({ kind: "guest", csrfToken: token, expiresAt: "2030-01-01T00:00:00Z" });

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function csrfFailed() {
  return json({ error: { code: "csrf_failed", message: "The token is wrong.", requestId: "req-1" } }, 403);
}

/** A client whose fetch is a function of the test, and the list of the requests that it got. */
function setup(handler: (request: Request) => Response | Promise<Response>) {
  const requests: Request[] = [];
  const api = createApiClient({
    baseUrl: "http://portal.test",
    fetch: async (request) => {
      requests.push(request);
      return handler(request);
    },
  });
  return { api, requests };
}

beforeEach(() => setCsrfToken(null));

describe("the CSRF token", () => {
  it("is read from GET /api/session and sent on a write, and a read does not carry it", async () => {
    const { api, requests } = setup((request) =>
      request.method === "GET" ? json(session("token-1")) : new Response(null, { status: 204 }),
    );

    await api.GET("/api/session");
    await api.DELETE("/api/session");
    await api.GET("/api/session");

    expect(requests.map((r) => r.headers.get("X-CSRF-Token"))).toEqual([null, "token-1", null]);
  });

  it("is taken only from the routes that carry it", async () => {
    const { api, requests } = setup((request) =>
      new URL(request.url).pathname === "/api/config" ? json({ csrfToken: "not-a-session" }) : new Response(null, { status: 204 }),
    );

    await api.GET("/api/config");
    await api.DELETE("/api/session");

    expect(requests[1].headers.get("X-CSRF-Token")).toBeNull();
  });

  it("is read again after csrf_failed, and the caller still gets the original answer", async () => {
    let calls = 0;
    const { api, requests } = setup((request) => {
      if (request.method === "GET") return json(session("token-2"));
      calls += 1;
      return calls === 1 ? csrfFailed() : new Response(null, { status: 204 });
    });
    setCsrfToken("old-token");

    const error = await unwrap(api.DELETE("/api/session")).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe("csrf_failed");
    expect(error.requestId).toBe("req-1");

    await api.DELETE("/api/session");
    const writes = requests.filter((r) => r.method === "DELETE");
    expect(writes.map((r) => r.headers.get("X-CSRF-Token"))).toEqual(["old-token", "token-2"]);
  });

  it("keeps the original 403 when the refresh fails", async () => {
    const { api } = setup((request) => {
      if (request.method === "GET") throw new TypeError("offline");
      return csrfFailed();
    });
    setCsrfToken("old-token");

    const error = await unwrap(api.DELETE("/api/session")).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe("csrf_failed");
    expect(error.status).toBe(403);
  });
});

describe("a list in the query", () => {
  it("is sent as one comma separated value", async () => {
    const { api, requests } = setup(() => json({ items: [], total: 0 }));

    await api.GET("/api/admin/tickets", { params: { query: { status: ["disetujui", "siap_diambil"], limit: 20 } } });

    const url = new URL(requests[0].url);
    expect(url.searchParams.getAll("status")).toEqual(["disetujui,siap_diambil"]);
    expect(url.searchParams.get("limit")).toBe("20");
  });
});

describe("unwrap", () => {
  it("gives the data of a good answer", async () => {
    const { api } = setup(() => json(session("token-3")));
    await expect(unwrap(api.GET("/api/session"))).resolves.toMatchObject({ kind: "guest", csrfToken: "token-3" });
  });

  it("throws an ApiError with the code of the error body", async () => {
    const { api } = setup(() => json({ error: { code: "unauthenticated", message: "Sign in.", requestId: "r" } }, 401));
    const error = await unwrap(api.GET("/api/session")).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(401);
    expect(error.code).toBe("unauthenticated");
  });

  it("throws an ApiError with the code network when the request fails", async () => {
    const { api } = setup(() => {
      throw new TypeError("fetch failed");
    });
    const error = await unwrap(api.GET("/api/session")).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
    expect(error.code).toBe("network");
    expect(error.message).toBe("fetch failed");
  });
});
