import { expect, test } from "@playwright/test";
import { site } from "../../lib/site";

// <head> metadata is server-rendered and identical in every browser.
// Scoping to Chromium avoids 220 redundant executions (4 routes × 11 tests × 5 browsers).
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Server-rendered metadata is browser-agnostic — Chromium only"
);

const pages = [
  {
    path: "/",
    title: site.pages.home.title,
    description: site.pages.home.description,
    canonical: "/",
    // Home og:url is the canonical domain (site.url), not just "/".
    // Sub-pages check for the path as a substring because Next.js prefixes it with the origin.
    ogUrl: site.url,
  },
  {
    path: "/about",
    title: `${site.pages.about.title} — ${site.name}`,
    description: site.pages.about.description,
    canonical: "/about",
    ogUrl: "/about",
  },
  {
    path: "/services",
    title: `${site.pages.services.title} — ${site.name}`,
    description: site.pages.services.description,
    canonical: "/services",
    ogUrl: "/services",
  },
  {
    path: "/contact",
    title: `${site.pages.contact.title} — ${site.name}`,
    description: site.pages.contact.description,
    canonical: "/contact",
    ogUrl: "/contact",
  },
];

for (const { path, title, description, canonical, ogUrl } of pages) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("has correct <title>", async ({ page }) => {
      await expect(page).toHaveTitle(title);
    });

    test("has correct meta description", async ({ page }) => {
      const content = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(content).toBe(description);
    });

    test("has correct canonical URL", async ({ page }) => {
      const href = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(href).toContain(canonical);
    });

    test("has og:title", async ({ page }) => {
      const content = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");
      expect(content).toBe(title);
    });

    test("has og:description", async ({ page }) => {
      const content = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");
      expect(content).toBe(description);
    });

    test("has og:image", async ({ page }) => {
      const content = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");
      expect(content).toBeTruthy();
    });

    test("has og:url matching the canonical", async ({ page }) => {
      const content = await page
        .locator('meta[property="og:url"]')
        .getAttribute("content");
      expect(content).toContain(ogUrl);
    });

    test("has twitter:card set to summary_large_image", async ({ page }) => {
      const content = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute("content");
      expect(content).toBe("summary_large_image");
    });

    test('has <html lang="en">', async ({ page }) => {
      const lang = await page.locator("html").getAttribute("lang");
      expect(lang).toBe("en");
    });

    test("has viewport meta tag", async ({ page }) => {
      const content = await page
        .locator('meta[name="viewport"]')
        .getAttribute("content");
      expect(content).toContain("width=device-width");
    });

    test("has exactly one <h1>", async ({ page }) => {
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    });
  });
}
