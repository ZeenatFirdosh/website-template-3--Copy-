import { expect, test } from "@playwright/test";
import { site } from "../../lib/site";

const routes = ["/", ...site.nav.map(({ href }) => href)];

test.describe("horizontal overflow", () => {
  for (const path of routes) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path);
      const hasOverflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
      );
      expect(hasOverflow, `Horizontal overflow detected on ${path}`).toBe(
        false
      );
    });
  }
});
