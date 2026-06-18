import { expect, test } from "@playwright/test";
import { site } from "../../lib/site";

test.describe("navigation", () => {
  test("nav links navigate to the correct pages", async ({
    page,
    viewport,
  }) => {
    const isMobile = (viewport?.width ?? 1280) < 768;
    for (const { label, href } of site.nav) {
      await page.goto("/");
      if (isMobile) {
        await page
          .getByRole("button", { name: "Open navigation menu" })
          .click();
        await page
          .getByRole("dialog")
          .getByRole("link", { name: label })
          .click();
      } else {
        await page
          .getByRole("banner")
          .getByRole("link", { name: label })
          .click();
      }
      await expect(page).toHaveURL(new RegExp(href));
    }
  });
});
