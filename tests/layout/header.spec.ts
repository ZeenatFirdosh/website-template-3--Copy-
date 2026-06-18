import { expect, test } from "@playwright/test";
import { site } from "../../lib/site";

test.describe("header", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("site name links to home", async ({ page }) => {
    const link = page
      .getByRole("banner")
      .getByRole("link", { name: site.name });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/");
  });

  // viewport is a test argument, so the skip condition must run inside the test body.
  test("desktop: shows all nav links with correct hrefs", async ({
    page,
    viewport,
  }) => {
    if ((viewport?.width ?? 1280) < 768) {
      test.skip();
    }
    for (const { label, href } of site.nav) {
      const link = page.getByRole("banner").getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    }
  });

  test("mobile: shows all nav links inside the sheet with correct hrefs", async ({
    page,
    viewport,
  }) => {
    if ((viewport?.width ?? 1280) >= 768) {
      test.skip();
    }
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    for (const { label, href } of site.nav) {
      const link = page.getByRole("dialog").getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
    }
  });

  test("mobile: sheet closes on Escape and returns focus to trigger", async ({
    page,
    viewport,
  }) => {
    if ((viewport?.width ?? 1280) >= 768) {
      test.skip();
    }
    const trigger = page.getByRole("button", {
      name: "Open navigation menu",
    });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("mobile: Tab is trapped within the open sheet", async ({
    page,
    viewport,
  }) => {
    if ((viewport?.width ?? 1280) >= 768) {
      test.skip();
    }
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // Tab several times — focus must stay inside the dialog.
    for (let i = 0; i < site.nav.length + 2; i++) {
      await page.keyboard.press("Tab");
      const isInsideDialog = await dialog
        .locator(":focus")
        .count()
        .then((n) => n > 0);
      expect(isInsideDialog).toBe(true);
    }
  });
});
