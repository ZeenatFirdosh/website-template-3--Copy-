# website-template-3

A Next.js 16 marketing site template. Built with React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

---

## Getting Started

```bash
# 1. Install dependencies (also sets up git hooks automatically)
pnpm install

# 2. Install Playwright browsers (required to run E2E tests — one-time setup)
pnpm exec playwright install --with-deps

# 3. Set up environment variables
cp .env.example .env.local

# 4. Fill in .env.local (see Environment Variables below)

# 5. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BASE_URL` | Yes | Full public URL of the site, no trailing slash (e.g. `https://yoursite.com`). Used for canonical URLs, OG tags, sitemap, and robots.txt. |
| `RESEND_API_KEY` | Yes | API key from [resend.com](https://resend.com) for sending emails from the contact form. |

---

## Customization

All site-wide content lives in one file: **`lib/site.ts`**

Edit it to update the site name, tagline, contact details, social links, navigation, and per-page metadata. All pages, OG tags, sitemap, and robots.txt derive their values from this file automatically — no other files need touching for basic content changes.

---

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server at localhost:3000 |
| `pnpm build` | Production build |
| `pnpm start` | Start production server (requires `pnpm build` first) |
| `pnpm typecheck` | TypeScript type check (no emit) |
| `pnpm lint` | Lint and format check |
| `pnpm lint:fix` | Auto-fix lint and format issues |
| `pnpm test:unit` | Run Vitest unit tests |
| `pnpm test:unit:watch` | Run Vitest in watch mode |
| `pnpm test:unit:coverage` | Run unit tests with coverage report |
| `pnpm test` | Run Playwright E2E tests (headless) |
| `pnpm test:ui` | Run Playwright tests in interactive UI mode |
| `pnpm test:report` | Open the last Playwright HTML report |
| `pnpm analyze` | Build and open the interactive bundle visualizer |
| `pnpm bundle-size` | Check JS chunk sizes against limits (requires a prior build) |
| `pnpm lighthouse` | Build and run Lighthouse CI audit |
| `pnpm commit` | Interactive conventional commit prompt |
| `pnpm check` | Full check: typecheck + lint + unit tests + E2E tests (mirrors CI) |
| `pnpm validate` | Everything: `check` + bundle size + Lighthouse (full local validation) |

---

## Testing

There are two test layers:

**Unit tests** (Vitest) — cover `lib/`, `emails/`, and `app/contact/actions.ts`. Fast, no browser required.

```bash
pnpm test:unit              # run once
pnpm test:unit:watch        # watch mode
pnpm test:unit:coverage     # with coverage report (90% line/function, 85% branch thresholds)
```

**E2E tests** (Playwright) — run across 5 devices (3 desktop, 2 mobile) and are organized into suites: `smoke/`, `seo/`, `a11y/`, `layout/`, `performance/`, and `contact/`.

Install the Playwright browsers once before running E2E tests:

```bash
pnpm exec playwright install --with-deps
```

Then:

```bash
pnpm test          # headless, all devices
pnpm test:ui       # interactive UI for debugging a specific test
```

Failed runs save screenshots and traces to `playwright-report/`. Open the report with:

```bash
pnpm test:report
```

---

## Git Workflow

This project uses **conventional commits** enforced by Commitizen and Husky.

Always use `pnpm commit` instead of `git commit` directly — it launches an interactive prompt that formats your commit message correctly:

```bash
git add <files>
pnpm commit
```

Hooks run automatically:
- **pre-commit** — lint-staged (auto-fix staged files)
- **pre-push** — typecheck

---

## CI

A single **`ci.yml`** workflow runs on every push and pull request to `dev` and `main`. It has two jobs:

**`test`** — runs on every push/PR to `dev` or `main`:
1. Typecheck → lint
2. Unit tests with coverage (artifact uploaded)
3. Build (with Next.js cache)
4. E2E tests (Playwright, with browser cache)
5. Bundle size check (artifact uploaded)

**`lighthouse`** — runs only after `test` passes on a push to `main`. Builds the app and runs Lighthouse CI. Performance and best practices warn on regression; SEO and accessibility fail hard.

Set `BASE_URL` as a repository secret for accurate canonical URL and sitemap testing in CI. Without it, tests fall back to `https://example.com`.

### Performance testing

| Tool | What it catches | When it runs |
|---|---|---|
| Playwright (`tests/performance/`) | FCP and TTFB regressions across all pages | Every `pnpm test` |
| Lighthouse CI (`lighthouserc.cjs`) | Performance score, Core Web Vitals, SEO, best practices | `pnpm lighthouse` / `lighthouse` CI job |
| Bundle size (`scripts/check-bundle-size.mjs`) | JS chunks exceeding 500KB (catches accidental large imports) | Every CI run / `pnpm validate` |
