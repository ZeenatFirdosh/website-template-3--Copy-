import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/services", "/contact"];

for (const path of routes) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    // axe results are browser-agnostic — running on all browsers wastes time.
    // test.skip() is called inside the test body (not at describe level) because
    // `browserName` is only available as a test argument, not in describe scope.
    test("no accessibility violations (axe WCAG 2.0/2.1 A + AA)", async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== "chromium", "axe runs on Chromium only");
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("interactive elements have a visible focus indicator", async ({
      page,
      browserName,
    }) => {
      // Same pattern: test.skip() in-body because browserName requires test scope.
      test.skip(
        browserName !== "chromium",
        "focus style check on Chromium only"
      );
      await page.keyboard.press("Tab");
      const outline = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) {
          return "none";
        }
        const styles = window.getComputedStyle(el);
        return styles.outlineWidth;
      });
      expect(outline).not.toBe("0px");
    });
  });
}
