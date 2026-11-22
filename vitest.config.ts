import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      // The pages and components have no unit tests, and session.ts and query-provider.tsx need a React tree, so only the plain modules count
      include: ["src/lib/api/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.d.ts", "src/lib/api/session.ts"],
    },
  },
});
