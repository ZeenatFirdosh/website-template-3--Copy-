import { test as base, type Page } from "@playwright/test";

// ─── Top-level regex constants ─────────────────────────────────────────────────

const NAME_RE = /name/i;
const EMAIL_RE = /email/i;
const SUBJECT_RE = /subject/i;
const MESSAGE_RE = /message/i;
const SEND_RE = /send/i;
const SUCCESS_RE = /sent|success/i;
const ERROR_RE = /failed|error/i;

// ─── Contact page object ───────────────────────────────────────────────────────
// Keeps all contact-form selectors in one place so a redesign only requires
// editing here, not every spec file.

class ContactPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/contact");
  }

  field(label: RegExp | string) {
    return this.page.getByLabel(label);
  }

  submitButton() {
    return this.page.getByRole("button", { name: SEND_RE });
  }

  async fillValid() {
    await this.field(NAME_RE).fill("Jane Smith");
    await this.field(EMAIL_RE).fill("jane@example.com");
    await this.field(SUBJECT_RE).fill("Project inquiry");
    await this.field(MESSAGE_RE).fill("Hello, I would like to work with you.");
  }

  async submit() {
    await this.submitButton().click();
  }

  errorFor(label: RegExp | string) {
    // Assumes each field's error is associated via aria-describedby or adjacent text.
    return this.page.getByLabel(label).locator("..");
  }

  successToast() {
    return this.page.getByRole("status").filter({ hasText: SUCCESS_RE });
  }

  errorToast() {
    return this.page.getByRole("alert").filter({ hasText: ERROR_RE });
  }
}

// ─── Extended test fixture ─────────────────────────────────────────────────────

export const test = base.extend<{ contactPage: ContactPage }>({
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});
