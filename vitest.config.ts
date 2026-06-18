import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "emails/**/*.test.ts", "app/**/*.test.ts"],
    // Vite sets BASE_URL="/" (its base option) which conflicts with site.url.
    // Override to a real URL so new URL(site.url) never throws in unit tests.
    env: {
      BASE_URL: "https://example.com",
    },
    coverage: {
      provider: "v8",
      include: ["lib/**", "emails/**", "app/contact/actions.ts"],
      exclude: [
        "lib/utils.ts", // thin clsx+tailwind-merge wrapper — no logic to unit-test
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
      },
    },
  },
});
