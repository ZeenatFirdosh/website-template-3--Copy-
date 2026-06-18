import { expect, test } from "@playwright/test";

// Thresholds are intentionally loose — these run on localhost with no CPU/network
// throttling. Goal: catch catastrophic regressions (e.g. a 5MB accidental import),
// not to replace Lighthouse scoring. Tight thresholds live in lighthouserc.cjs.
//
// Restricted to Chromium: the Performance API (FCP, navigation timing, CLS
// PerformanceObserver) is unreliable in Firefox/Safari Playwright contexts.
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Performance API is only reliable in Chromium"
);

const THRESHOLDS = {
  fcp: 3000, // First Contentful Paint (ms)
  ttfb: 800, // Time to First Byte (ms)
  cls: 0.1, // Cumulative Layout Shift score
};

const routes = ["/", "/about", "/services", "/contact"];

for (const path of routes) {
  test.describe(path, () => {
    test("FCP is within threshold", async ({ page }) => {
      await page.goto(path, { waitUntil: "load" });
      const fcp = await page.evaluate(() => {
        const entry = performance.getEntriesByName("first-contentful-paint")[0];
        return entry?.startTime ?? null;
      });
      expect(
        fcp,
        "FCP entry not found — paint may have been suppressed"
      ).not.toBeNull();
      expect(fcp as number).toBeLessThan(THRESHOLDS.fcp);
    });

    test("TTFB is within threshold", async ({ page }) => {
      await page.goto(path, { waitUntil: "load" });
      const ttfb = await page.evaluate(() => {
        const nav = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        return nav?.responseStart ?? null;
      });
      expect(ttfb, "Navigation timing entry not found").not.toBeNull();
      expect(ttfb as number).toBeLessThan(THRESHOLDS.ttfb);
    });

    test("CLS is within threshold", async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let total = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutEntry = entry as PerformanceEntry & {
                hadRecentInput: boolean;
                value: number;
              };
              if (!layoutEntry.hadRecentInput) {
                total += layoutEntry.value;
              }
            }
          });
          observer.observe({ type: "layout-shift", buffered: true });
          // Allow a short settle time for any late shifts.
          setTimeout(() => {
            observer.disconnect();
            resolve(total);
          }, 500);
        });
      });
      expect(cls).toBeLessThan(THRESHOLDS.cls);
    });
  });
}
