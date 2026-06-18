# Testing Guide

This project uses two complementary test layers: **Vitest** for fast, in-process unit tests, and **Playwright** for full browser E2E tests. Both run in CI on every push and PR.

---

## Prerequisites

Before running E2E tests for the first time, install the Playwright browser binaries:

```bash
pnpm exec playwright install --with-deps
```

This is a **one-time step** per machine. If E2E tests fail with "Executable doesn't exist" or similar browser-not-found errors, this command is the fix.

---

## Quick reference

| Command | What it does |
|---|---|
| `pnpm test:unit` | Run all unit tests once |
| `pnpm test:unit:watch` | Unit tests in watch mode (re-runs on save) |
| `pnpm test:unit:coverage` | Unit tests + coverage report (enforces thresholds) |
| `pnpm test` | Run all E2E tests headless |
| `pnpm test:ui` | Open the Playwright visual debugger |
| `pnpm test:report` | Open the last Playwright HTML report |
| `pnpm check` | Typecheck + lint + unit + E2E — run this before opening a PR |

---

## Layer 1 — Unit tests (Vitest)

Unit tests live **next to the source file they test** (co-located). They run in Node.js, have no browser, and complete in seconds.

### Coverage thresholds

CI enforces these thresholds on `pnpm test:unit:coverage`. The pipeline fails if any threshold is missed.

| Metric | Threshold |
|---|---|
| Lines | 90% |
| Functions | 90% |
| Branches | 85% |

**What's covered:**

- `lib/**` — utilities and schemas
- `emails/**` — email templates
- `app/contact/actions.ts` — the contact form server action

**What's excluded:**

- `lib/utils.ts` — a thin `clsx` + `tailwind-merge` wrapper with no testable logic
- The default `ContactEmailPreview` export in `emails/contact.tsx` — it's a preview entrypoint, not production code

### Unit test files

#### `lib/schemas/contact.test.ts` — Zod schema validation

Tests the `contactFormSchema` exported from `lib/schemas/contact.ts`. Covers:

- Valid payloads (with and without the optional `phone` field)
- Empty-string `phone` being coerced to `undefined`
- Non-empty `phone` value preserved as-is
- Error messages for each required field
- All-field-missing empty payload

#### `lib/site.test.ts` — `createPageMetadata` utility

Tests the `createPageMetadata` function from `lib/site.ts`. Covers:

- `title`, `description`, `alternates.canonical` fields
- `openGraph` shape: `title` format, `url`, `images` (1200×630, correct `alt`)
- `twitter.card` value (`summary_large_image`)
- Description propagated to both `openGraph` and `twitter`
- Parameterised smoke test across all four pages via `it.each`

#### `emails/contact.test.ts` — React Email template

Tests the `ContactEmail` component by rendering it to HTML and asserting on the output. Covers:

- Sender name, email, subject, and message appear in the output
- Phone section is included when `phone` is provided and omitted when it isn't
- `siteName` and `siteUrl` appear in the brand/footer block
- Default fallbacks (`siteName → "Website"`, `siteUrl → "#"`) when props are omitted
- `white-space: pre-wrap` styling on the message block
- Multi-line message content is preserved

#### `app/contact/actions.test.ts` — `sendContactEmail` server action

The most complex unit test file. It mocks three external modules (`resend`, `@sentry/nextjs`, `@react-email/render`) and tests the full server action logic. Covers:

- **Validation** — empty fields return `fieldErrors`, invalid email returns a field error, only the first Zod issue per field is surfaced (not a list), send is never called on validation failure
- **Successful send** — `{ success: true }` returned, Resend called once, `replyTo` set to sender's email, subject prefixed with `[Contact]`
- **Email addressing** — `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` env vars used when set; fallback to `site.contact.email` / `noreply@<hostname>` when unset
- **Render failure** — generic error returned to caller, exception captured to Sentry with context, Resend not called
- **Resend API failure** — generic error returned, Sentry notified with `resendErrorName` + sender context, raw API error message never leaked to caller

---

## Layer 2 — E2E tests (Playwright)

E2E tests live in `tests/` and are organised by concern. Playwright launches a real browser and hits a running Next.js server.

### Browser matrix

Tests run across **5 browser projects**:

| Project | Device |
|---|---|
| Desktop Chrome | 1280×720 |
| Desktop Firefox | 1280×720 |
| Desktop Safari | 1280×720 |
| Mobile Chrome (Pixel 5) | 393×851 |
| Mobile Safari (iPhone 14) | 390×844 |

Many specs are deliberately scoped to **Chromium only** when the behaviour they check is server-rendered or browser-agnostic (HTTP responses, `<head>` metadata, axe scans). Running those on all five browsers would multiply execution time with no added signal. The scoping comment in each file explains the rationale.

### E2E spec files

#### `tests/smoke/routes.spec.ts` — HTTP smoke checks

Chromium only.

- Every route (`/`, `/about`, `/services`, `/contact`) returns HTTP 200
- No `console.error` calls or uncaught exceptions on any route (listeners attached before navigation)
- Unknown route (`/this-route-does-not-exist`) returns 404 and renders an `<h1>`

#### `tests/seo/metadata.spec.ts` — `<head>` metadata

Chromium only. Parameterised across all four pages. Checks:

- `<title>` matches the expected value from `lib/site.ts`
- `meta[name="description"]` content
- `link[rel="canonical"]` href
- `og:title`, `og:description`, `og:image`, `og:url`
- `twitter:card` = `summary_large_image`
- `<html lang="en">`
- `meta[name="viewport"]` contains `width=device-width`
- Exactly one `<h1>` that is visible

#### `tests/seo/static-files.spec.ts` — Static file availability

Chromium only. Uses the `request` fixture (HTTP only, no rendering).

- `/favicon.ico` returns 200
- `/og-image.png` returns 200, has an `image/*` content-type, and is exactly 1200×630 pixels (verified by reading the PNG IHDR bytes directly)
- `/sitemap.xml` returns 200 and lists all routes from `site.nav`
- `/robots.txt` returns 200 and contains `Allow: /`

#### `tests/layout/header.spec.ts` — Header component

Runs on all browsers.

- Site name link points to `/`
- Desktop: all nav links are visible with correct hrefs
- Mobile: nav links appear inside the sheet dialog after the menu button is clicked
- Mobile: Escape key closes the sheet and returns focus to the trigger button
- Mobile: Tab key stays trapped inside the open sheet (focus trap)

The desktop/mobile tests skip themselves at runtime based on `viewport.width` — this is necessary because `viewport` is only available as a test argument, not at the `describe` scope.

#### `tests/layout/footer.spec.ts` — Footer component

Runs on all browsers.

- Site name link points to `/`
- Copyright block contains the site name and current year
- Footer nav lists all links from `site.nav` with correct hrefs
- Author credit link (`site.author.name`) points to `site.author.url`
- Active social links (those with non-empty URLs in `site.social`) are present and point to the correct URL

Social links are matched by `href`, not by text content, because short platform names like "X" are too ambiguous to match reliably.

#### `tests/layout/navigation.spec.ts` — Click-through navigation

Runs on all browsers.

- Clicking each nav link navigates to the correct URL, on both desktop (via the header link) and mobile (via the sheet dialog)

#### `tests/layout/overflow.spec.ts` — Horizontal overflow

Runs on **all browsers** because overflow behaviour differs between engines.

- Every route has no horizontal scrollbar (`scrollWidth <= clientWidth`)

#### `tests/a11y/a11y.spec.ts` — Accessibility

Parameterised across all four routes.

- **axe scan** (Chromium only): zero WCAG 2.0/2.1 Level A + AA violations — runs `@axe-core/playwright` with tags `["wcag2a", "wcag2aa"]`
- **Focus indicator** (Chromium only): the first interactive element reached by Tab has a non-zero `outline-width` — this is a spot check on the first Tab stop, not a full scan of every interactive element

The `test.skip()` calls are inside the test body rather than at the `describe` scope because `browserName` is only accessible as a test argument.

#### `tests/contact/form.spec.ts` — Contact form acceptance spec

All tests are marked `test.fixme()` until the form is built in `app/contact/page.tsx`. They serve as the **acceptance specification** — when you implement the form, remove the `test.fixme()` calls and the tests should pass.

Once the form exists, these tests cover:

- Form renders with labeled Name, Email, Subject, Message fields and a submit button
- Inline validation errors shown for each empty required field on submit
- Email-format error for a malformed email
- Field error clears after correcting the field and resubmitting
- Submit button shows a disabled/loading state while the action is running
- Success toast shown and form reset on a valid submission
- Error toast shown and field values preserved on a failed submission (network abort injected via `page.route()` to guarantee failure without needing a real Resend key)
- Form is navigable and submittable by keyboard alone

#### `tests/performance/web-vitals.spec.ts` — Core Web Vitals

Chromium only. Parameterised across all four routes. Thresholds are **loose** (intended to catch catastrophic regressions, not replace Lighthouse):

| Metric | Threshold | Why loose |
|---|---|---|
| FCP (First Contentful Paint) | < 3000 ms | No CPU throttling on localhost |
| TTFB (Time to First Byte) | < 800 ms | No network throttling on localhost |
| CLS (Cumulative Layout Shift) | < 0.1 | Tight Lighthouse thresholds live in `lighthouserc.cjs` |

### Accessibility coverage summary

Accessibility checks are spread across several spec files, not just `a11y.spec.ts`. Here is the complete picture:

| What is checked | Where | Standard |
|---|---|---|
| Zero axe violations (A + AA rules) | `a11y/a11y.spec.ts` | WCAG 2.0/2.1 Level A and AA |
| Focus indicator visible on first Tab stop | `a11y/a11y.spec.ts` | WCAG 2.0 SC 2.4.7 |
| `<html lang="en">` present | `seo/metadata.spec.ts` | WCAG 2.0 SC 3.1.1 |
| Exactly one `<h1>` per page | `seo/metadata.spec.ts` | WCAG 2.0 SC 1.3.1 / 2.4.6 |
| Mobile nav: Escape closes sheet and returns focus to trigger | `layout/header.spec.ts` | WCAG 2.1 SC 2.1.2 / focus management |
| Mobile nav: Tab focus trapped inside open dialog | `layout/header.spec.ts` | WCAG 2.1 SC 2.1.2 |
| ARIA landmark roles present (`banner`, `contentinfo`, `navigation`, `dialog`) | `layout/header.spec.ts`, `layout/footer.spec.ts` | WCAG 2.0 SC 1.3.1 / ARIA landmarks |
| All form fields have associated `<label>` elements | `contact/form.spec.ts` | WCAG 2.0 SC 1.3.1 / SC 4.1.2 |
| Validation errors exposed as `role="alert"` | `contact/form.spec.ts` | WCAG 2.0 SC 4.1.3 |
| Form fully operable by keyboard alone | `contact/form.spec.ts` | WCAG 2.0 SC 2.1.1 |

**What is NOT covered:**

- **WCAG 2.2** — `wcag22a` / `wcag22aa` axe tags are not used; SC 2.4.11 (Focus Appearance) and SC 3.2.6 (Consistent Help) are not checked
- **axe `best-practice` tag** — additional recommended checks beyond WCAG (e.g. landmark uniqueness, meta viewport scalability) are not run
- **Comprehensive focus indicator scan** — the focus test checks only the first Tab stop per page, not every interactive element
- **Colour contrast at specific sizes** — axe checks general contrast but does not verify against a specific brand colour palette
- **Screen reader announcements** — live region behaviour and announcement order are not tested

---

### Page-object fixture (`tests/fixtures.ts`)

`form.spec.ts` imports `test` from `../fixtures` rather than `@playwright/test`. The fixture extends the base `test` with a `contactPage` object that wraps all contact-form selectors and interactions:

```ts
import { test } from "../fixtures";

test("example", async ({ contactPage, page }) => {
  await contactPage.goto();           // navigate to /contact
  await contactPage.fillValid();      // fill all required fields with valid data
  await contactPage.submit();         // click the submit button
  contactPage.submitButton()          // Locator for the submit button
  contactPage.errorFor(NAME_RE)       // Locator for the error region of a field
  contactPage.successToast()          // Locator for the success toast
  contactPage.errorToast()            // Locator for the error toast
});
```

Keeping selectors in the fixture means a form redesign only requires editing `fixtures.ts`, not every spec.

---

## CI pipeline

### `test` job (every push and PR to `dev` or `main`)

Steps run in this order:

1. **Typecheck** — `tsc --noEmit`
2. **Lint** — `ultracite check`
3. **Unit tests + coverage** — `vitest run --coverage` (fails if thresholds are missed)
4. **Build** — `next build`
5. **E2E tests** — `playwright test` against the built output
6. **Bundle size check** — `scripts/check-bundle-size.mjs`

Coverage report and Playwright HTML report are uploaded as workflow artifacts (retained 30 days).

On **CI**, Playwright:
- Sets `retries: 1` (one automatic retry on flakiness)
- Limits to `workers: 2` (prevents resource contention on GitHub runners)
- Fails the build on `test.only()` calls (`forbidOnly: true`)

### `lighthouse` job (push to `main` only)

Runs after `test` passes. Builds the project and runs Lighthouse CI against thresholds defined in `lighthouserc.cjs`. Not triggered on PRs — Lighthouse scores are noisy on shared CI runners and produce false positives.

---

## Non-obvious patterns and gotchas

### `vi.hoisted()` in `actions.test.ts`

`vi.mock()` factory functions are hoisted to the top of the file at compile time. If a factory captures a variable declared with `const mockFoo = vi.fn()`, that variable is `undefined` when the factory first runs (because the `const` declaration hasn't executed yet). `vi.hoisted()` runs its callback during the hoisting phase, so the variable is properly initialised:

```ts
// WRONG — mockFn is undefined when the vi.mock factory runs
const mockFn = vi.fn();
vi.mock("some-module", () => ({ fn: mockFn }));

// CORRECT — vi.hoisted() runs before the mock factory
const mockFn = vi.hoisted(() => vi.fn());
vi.mock("some-module", () => ({ fn: mockFn }));
```

### `withEnvUnset()` vs `vi.stubEnv(key, '')`

The `sendContactEmail` action uses `??` (nullish coalescing) to fall back when env vars are absent:

```ts
const to = process.env.CONTACT_TO_EMAIL ?? site.contact.email;
```

`vi.stubEnv("CONTACT_TO_EMAIL", "")` sets the variable to an empty string, which is a **defined value** — `??` will not fall through. To trigger the fallback, the key must be **deleted entirely**. The `withEnvUnset()` helper in `actions.test.ts` does this and restores the original value after the test:

```ts
await withEnvUnset("CONTACT_TO_EMAIL", async () => {
  await sendContactEmail(validPayload);
  // action now uses site.contact.email as the fallback
});
```

### `vi.stubEnv` / `vi.unstubAllEnvs` isolation

`actions.test.ts` stubs `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` in `beforeEach` and restores them in `afterEach` via `vi.unstubAllEnvs()`. This isolates every test from whatever is in the real `.env` file. Never read `process.env` directly in a test without first considering whether the value could differ between environments.

### `BASE_URL` in `vitest.config.ts`

Vite sets `BASE_URL = "/"` internally (its base URL option). This conflicts with `lib/site.ts`, which reads `process.env.BASE_URL` as the full site URL. The config overrides it to `"https://example.com"` so unit tests never see `BASE_URL = "/"`:

```ts
// vitest.config.ts
test: {
  env: { BASE_URL: "https://example.com" }
}
```

### `test.skip()` inside the test body

Some tests call `test.skip()` conditionally inside the test body rather than at the `describe` scope. This is because `browserName` and `viewport` are only available as test arguments — they don't exist at describe-level scope. For example:

```ts
test("desktop only", async ({ page, viewport }) => {
  if ((viewport?.width ?? 1280) < 768) {
    test.skip(); // viewport only accessible here, not in describe()
  }
  // ...
});
```

This is documented Playwright behaviour, not an error.

### Chromium-only scoping (file-level)

Several spec files use a file-level `test.skip` to restrict execution to Chromium:

```ts
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Server-rendered metadata is browser-agnostic — Chromium only"
);
```

This is different from calling `test.skip()` inside a single test — it applies to the **entire file**. The tests still appear in Playwright's report for non-Chromium projects but are marked as skipped, not missing.

### Home-page `og:url` in `metadata.spec.ts`

The home page entry uses `ogUrl: site.url` (the full `https://...` domain), while all other pages use a path like `"/about"`. This is intentional: the home page's canonical `og:url` should be the bare domain URL, not `"/"`. The test uses `toContain(ogUrl)`, so the path check on sub-pages works because `"https://example.com/about"` contains `"/about"`.

### `browser.newContext()` in `routes.spec.ts`

The console-error test creates a fresh context with `browser.newContext()` instead of using the `page` fixture. The `page` fixture pre-creates a page before your test body runs, leaving a small window between page creation and when you can attach event listeners. Creating a fresh context inside the test body lets you attach `console` and `pageerror` listeners before calling `goto`, so no early errors can slip through.

---

## Writing new tests

### Adding a unit test

1. Create a `.test.ts` file next to the source file you are testing.
2. Import from `vitest` (not from `jest`).
3. If you need to mock a module, use `vi.hoisted()` for any variables the mock factory captures (see above).
4. Run `pnpm test:unit:watch` while you develop.
5. Run `pnpm test:unit:coverage` before committing to confirm thresholds still pass.

### Adding an E2E spec

1. Create a `.spec.ts` file in the appropriate `tests/` subdirectory.
2. Import `test` and `expect` from `@playwright/test` (or from `../fixtures` if you need the `contactPage` object).
3. If the test is browser-agnostic, add the file-level `test.skip` for non-Chromium projects.
4. Run `pnpm test:ui` to use the visual debugger while writing the spec.

### When to use each layer

| Situation | Use |
|---|---|
| Pure function, schema, or utility | Unit test (Vitest) |
| Server action logic, mocking external APIs | Unit test (Vitest) |
| Email template HTML output | Unit test (Vitest) |
| Page renders correctly in a browser | E2E (Playwright) |
| Navigation, keyboard interaction, focus management | E2E (Playwright) |
| SEO tags in the rendered `<head>` | E2E (Playwright) |
| Static files available and valid | E2E (Playwright) |
| Accessibility compliance | E2E (Playwright + axe) |
| Performance regressions | E2E (Playwright) + Lighthouse CI |
