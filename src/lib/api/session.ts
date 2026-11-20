"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import { api, unwrap } from "./client";
import { ApiError } from "./errors";

/** The session of the cookie. A visitor with no session gets `null` and not an error, and the screens then offer the sign in. */
export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    try {
      return await unwrap(api.GET("/api/session"));
    } catch (error) {
      if (error instanceof ApiError && (error.code === "unauthenticated" || error.code === "session_expired")) return null;
      throw error;
    }
  },
});

export function useSession() {
  return useQuery(sessionQuery);
}
