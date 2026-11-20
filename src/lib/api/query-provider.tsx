"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ApiError } from "./errors";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // The service answers no-store and stock changes at every approval, so this only spares a repeat call while a screen mounts
        staleTime: 10_000,
        // A 4xx answer will not change by asking again. A network failure or a 5xx answer gets two more tries.
        retry: (failures, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failures < 2,
      },
      // A repeated write could make a second ticket or a second batch of units
      mutations: { retry: false },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(makeQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
