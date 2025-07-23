import type { QueryClientConfig } from "@tanstack/react-query";

export const MockQueryClient: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      // Setting the stale time avoids refreshes, and allow use to have more control
      // over which query we expect to be made.
      staleTime: Infinity,
    },
  },
};

export const MockHeaders = { "Content-Type": "application/json" };
