/**
 * Contact form interaction tests.
 *
 * These tests describe the EXPECTED behavior of the contact form and serve
 * as the acceptance spec for building it. They will fail until the form is
 * implemented in app/contact/page.tsx with the following requirements:
 *   - A <form> with labeled fields: Name, Email, Subject, Message (required),
 *     and optionally Phone.
 *   - Inline field-level validation errors on failed submit.
 *   - A submit button that shows a loading/disabled state while the action runs.
 *   - A success toast (via sonner) and form reset on success.
 *   - An error toast and form values preserved on failure.
 */

import { expect } from "@playwright/test";
import { test } from "../fixtures";

// ─── Top-level regex constants ─────────────────────────────────────────────────

const NAME_RE = /name/i;
const EMAIL_RE = /email/i;
const SUBJECT_RE = /subject/i;
const MESSAGE_RE = /message/i;
const VALID_EMAIL_RE = /valid email/i;

test.describe("/contact form", () => {
  test.beforeEach(async ({ contactPage }) => {
    // Mark every test in this block as fixme until app/contact/page.tsx is built.
    // They will appear as "pending" in the report rather than "failing" in CI.
    test.fixme(
      true,
      "Contact form not yet implemented in app/contact/page.tsx — see testing-ci-report.md §4.1"
    );
    await contactPage.goto();
  });

  // ── Structure ────────────────────────────────────────────────────────────────

  test("renders a form element", async ({ page }) => {
    await expect(page.locator("form")).toBeVisible();
  });

  test("has labeled Name, Email, Subject and Message fields", async ({
    page,
  }) => {
    await expect(page.getByLabel(NAME_RE)).toBeVisible();
    await expect(page.getByLabel(EMAIL_RE)).toBeVisible();
    await expect(page.getByLabel(SUBJECT_RE)).toBeVisible();
    await expect(page.getByLabel(MESSAGE_RE)).toBeVisible();
  });

  test("has a submit button", async ({ contactPage }) => {
    await expect(contactPage.submitButton()).toBeVisible();
  });

  // ── Validation ───────────────────────────────────────────────────────────────

  test("shows a validation error for each empty required field on submit", async ({
    contactPage,
  }) => {
    await contactPage.submit();
    // Errors are shown inline — assert that the form still has visible error text.
    await expect(
      contactPage.errorFor(NAME_RE).getByRole("alert")
    ).toBeVisible();
    await expect(
      contactPage.errorFor(EMAIL_RE).getByRole("alert")
    ).toBeVisible();
    await expect(
      contactPage.errorFor(SUBJECT_RE).getByRole("alert")
    ).toBeVisible();
    await expect(
      contactPage.errorFor(MESSAGE_RE).getByRole("alert")
    ).toBeVisible();
  });

  test("shows an email-format error for a malformed email", async ({
    page,
    contactPage,
  }) => {
    await page.getByLabel(NAME_RE).fill("Jane");
    await page.getByLabel(EMAIL_RE).fill("not-an-email");
    await page.getByLabel(SUBJECT_RE).fill("Hello");
    await page.getByLabel(MESSAGE_RE).fill("Test message");
    await contactPage.submit();
    await expect(contactPage.errorFor(EMAIL_RE)).toContainText(VALID_EMAIL_RE);
  });

  test("clears a field error after correcting the field and resubmitting", async ({
    page,
    contactPage,
  }) => {
    await contactPage.submit();
    await page.getByLabel(NAME_RE).fill("Jane Smith");
    await contactPage.submit();
    // Name error should be gone after fill + resubmit.
    const nameError = contactPage.errorFor(NAME_RE).getByRole("alert");
    await expect(nameError).toHaveCount(0);
  });

  // ── Submission ───────────────────────────────────────────────────────────────

  test("submit button shows a loading/disabled state while submitting", async ({
    contactPage,
  }) => {
    await contactPage.fillValid();
    const submitBtn = contactPage.submitButton();
    // Click and immediately check disabled state before response arrives.
    const clickPromise = contactPage.submit();
    await expect(submitBtn).toBeDisabled();
    await clickPromise;
  });

  test("shows a success toast and resets the form on a valid submission", async ({
    contactPage,
    page,
  }) => {
    await contactPage.fillValid();
    await contactPage.submit();
    await expect(contactPage.successToast()).toBeVisible({ timeout: 10_000 });
    // Form fields are reset after success.
    await expect(page.getByLabel(NAME_RE)).toHaveValue("");
  });

  test("shows an error toast and preserves field values on a failed submission", async ({
    contactPage,
    page,
  }) => {
    // Abort the server-action POST so the form's error handler is always exercised —
    // no dependency on env vars or a real Resend key.
    await page.route("**/contact", async (route) => {
      if (route.request().method() === "POST") {
        await route.abort("failed");
      } else {
        await route.continue();
      }
    });

    await contactPage.fillValid();
    await contactPage.submit();
    await expect(contactPage.errorToast()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByLabel(NAME_RE)).toHaveValue("Jane Smith");
  });

  // ── Keyboard ─────────────────────────────────────────────────────────────────

  test("form is navigable and submittable by keyboard alone", async ({
    page,
    contactPage,
  }) => {
    await page.getByLabel(NAME_RE).focus();
    await page.keyboard.type("Jane Smith");
    await page.keyboard.press("Tab");
    await page.keyboard.type("jane@example.com");
    await page.keyboard.press("Tab");
    await page.keyboard.type("Project inquiry");
    await page.keyboard.press("Tab");
    await page.keyboard.type("Hello from keyboard.");
    await contactPage.submitButton().focus();
    await page.keyboard.press("Enter");
    // Either success or error toast should appear — form was submitted.
    const appeared = await Promise.race([
      contactPage
        .successToast()
        .waitFor({ state: "visible", timeout: 10_000 })
        .then(() => true),
      contactPage
        .errorToast()
        .waitFor({ state: "visible", timeout: 10_000 })
        .then(() => true),
    ]).catch(() => false);
    expect(appeared).toBe(true);
  });
});
