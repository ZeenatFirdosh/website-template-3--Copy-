import { expect, test } from "@playwright/test";
import { site } from "../../lib/site";

test.describe("footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("site name links to home", async ({ page }) => {
    const link = page
      .getByRole("contentinfo")
      .getByRole("link", { name: site.name });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/");
  });

  test("shows copyright with site name and current year", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText(site.name);
    await expect(footer).toContainText(new Date().getFullYear().toString());
  });

  test("shows all nav links with correct hrefs", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Footer navigation" });
    for (const { label, href } of site.nav) {
      const link = nav.getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    }
  });

  test("shows author credit linking to the author URL", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    const link = footer.getByRole("link", { name: site.author.name });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", site.author.url);
  });

  const activeSocials = Object.entries(site.social).filter(
    ([, url]) => url !== ""
  );

  if (activeSocials.length > 0) {
    test("shows active social links with correct hrefs", async ({ page }) => {
      const footer = page.getByRole("contentinfo");
      for (const [, url] of activeSocials) {
        // Match by href — avoids fragile substring-matching on short platform names like "x".
        const link = footer.locator(`a[href="${url}"]`);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", url);
      }
    });
  }
});
