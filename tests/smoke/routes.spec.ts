import { expect, test } from "@playwright/test";

// HTTP smoke checks and server-rendered HTML are identical in every browser.
// Scoping to Chromium avoids running the same checks 5× for zero added signal.
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "HTTP smoke checks are browser-agnostic — Chromium only"
);

const routes = ["/", "/about", "/services", "/contact"];

for (const path of routes) {
  test.describe(path, () => {
    test("returns HTTP 200", async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
    });

    // Creates a fresh context to attach listeners before any navigation.
    // The `page` fixture pre-creates a page, so there is a brief window before
    // you can attach handlers where early errors could slip through.
    test("logs no console errors or uncaught exceptions", async ({
      browser,
    }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(`[console.error] ${msg.text()}`);
        }
      });
      page.on("pageerror", (err) => {
        errors.push(`[uncaught] ${err.message}`);
      });
      await page.goto(path);
      await ctx.close();
      expect(errors).toHaveLength(0);
    });
  });
}

test("unknown route returns 404", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toBeVisible();
});
