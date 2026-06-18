# Developer Guide

This template is designed so that **UI work stays in one place and config stays in another**. Read this before touching any files.

---

## Your job

You are creating a UI design variation. That means you own:

- Page layouts and sections (`app/*/page.tsx`)
- Shared components (`components/header.tsx`, `components/footer.tsx`)
- Styles (`app/globals.css`)
- Any new components you build (`components/`)

You do **not** change:

- `lib/site.ts` — content and config
- `app/layout.tsx` — root layout structure
- `app/og-image.png/route.tsx` — OG image generation
- `app/sitemap.ts`, `app/robots.ts` — SEO files
- `app/contact/actions.ts` — contact form server action
- `lib/schemas/contact.ts` — contact form validation schema
- `emails/contact.tsx` — email template (edit only for email design changes)
- `sentry.*.config.ts`, `instrumentation*.ts` — error monitoring
- `tests/`, `scripts/`, `.github/`, `lighthouserc.cjs` — tooling

---

## Setup

```bash
pnpm install
pnpm exec playwright install --with-deps  # first time only
pnpm dev
```

The repo includes a `.env` file with defaults for local development. The variables you may need to change:

| Variable | Required | Description |
| --- | --- | --- |
| `BASE_URL` | Yes | Full URL of the site, no trailing slash (`http://localhost:3000` locally) |
| `RESEND_API_KEY` | Yes | From [resend.com/api-keys](https://resend.com/api-keys) |
| `CONTACT_TO_EMAIL` | No | Inbox that receives contact form submissions. Defaults to `site.contact.email` from `lib/site.ts` |
| `CONTACT_FROM_EMAIL` | No | Sender address. Defaults to `noreply@<your-domain>`. Must be a verified Resend domain in production |
| `NEXT_PUBLIC_SENTRY_DSN` | No | From Sentry project settings — leave blank to disable error tracking |

Open [http://localhost:3000](http://localhost:3000).

---

## Workflow

Check out from `dev` and work on your own branch:

```bash
git checkout dev
git checkout -b feat/ui
```

Use the commit prompt to format commits correctly:

```bash
git add <files>
pnpm commit
```

When ready, open a PR from your branch → `dev`. CI runs when the PR merges into `dev`.

---

## Key files to edit

### `lib/site.ts`
Read-only for you — but read it. It defines the site name, tagline, nav links, social links, and per-page copy. Your layouts should consume these values, not hardcode them.

### `app/globals.css`
Your main styling entry point. Add CSS variables, custom fonts, animations, or any global styles here. The `@theme inline` block maps CSS variables to Tailwind tokens.

### `app/*/page.tsx`
Each page is a blank canvas. Build your sections here. The `export const metadata` line at the top of each page is auto-generated — don't touch it.

### `app/not-found.tsx`
The 404 page is pre-styled to match the template theme. Customize it to fit your design — just keep a visible `<h1>` and a link back home (the test suite checks for both).

### `components/header.tsx` and `components/footer.tsx`
Style these freely. The mobile nav (`MobileNav`) and theme toggle (`ThemeToggle`) are already wired up as separate client components — you can restyle or replace them.

---

## Theming

Dark mode is class-based (`class="dark"` on `<html>`) and controlled by `next-themes`. The `ThemeToggle` component in the header switches between light and dark. To change the default:

```tsx
// components/providers.tsx
<ThemeProvider defaultTheme="light"> // or "dark" or "system"
```

To add brand colors, define them as CSS variables in `globals.css` and register them in `@theme inline`:

```css
:root {
  --brand: #2563eb;
}

@theme inline {
  --color-brand: var(--brand);
}
```

Then use `bg-brand`, `text-brand` etc. in your components.

---

## UI components

shadcn/ui components live in `components/ui/`. Add more with:

```bash
pnpm dlx shadcn@latest add <component-name>
```

---

## Contact form

The backend is fully implemented. Your job is to build the UI in `app/contact/page.tsx` and call the server action.

### What's available

```ts
// schema + type (safe to import on the client)
import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";

// server action + result type
import { sendContactEmail, type ContactActionResult } from "@/app/contact/actions";
```

| Export | File | What it is |
| --- | --- | --- |
| `sendContactEmail(data)` | `actions` | Server Action — validates, renders the email, sends via Resend |
| `ContactActionResult` | `actions` | Return type — `{ success: true }` or `{ success: false; fieldErrors?, error? }` |
| `contactFormSchema` | `lib/schemas/contact` | Zod schema — use with `zodResolver` for client-side validation |
| `ContactFormData` | `lib/schemas/contact` | TypeScript type inferred from the schema |

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | `string` | Yes | |
| `email` | `string` | Yes | Must be a valid email address |
| `phone` | `string` | No | Empty string is coerced to `undefined` — safe to bind directly to an input |
| `subject` | `string` | Yes | |
| `message` | `string` | Yes | |

### Wiring up the form

The action returns two distinct failure shapes — handle both:

```tsx
const result = await sendContactEmail(formValues);

if (!result.success) {
  if (result.fieldErrors) {
    // Validation failure — map errors to individual fields
    // result.fieldErrors.name, .email, .phone, .subject, .message
    // Each is a string | undefined (first failing message for that field)
  } else {
    // Send failure (Resend error, network issue, etc.)
    // Show result.error as a toast or inline banner
  }
}
```

### With react-hook-form + zodResolver

Install the resolver first — it is not included by default:

```bash
pnpm add react-hook-form @hookform/resolvers
```

The schema is already exported — no duplication needed:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { sendContactEmail } from "@/app/contact/actions";

export function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactFormData) {
    const result = await sendContactEmail(values);
    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof ContactFormData, { message });
        }
      } else {
        // show result.error in a toast
      }
      return;
    }
    // show success state
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* your fields */}</form>;
}
```

### What the email looks like

Run `pnpm email` to open the React Email preview. The template is in `emails/contact.tsx` — do not edit it unless you are changing the email design.

---

## Checking your work

```bash
pnpm check              # typecheck + lint + unit tests + E2E tests — run this before opening a PR
pnpm lint               # lint only
pnpm lint:fix           # auto-fix lint errors
pnpm typecheck          # type check only
pnpm test:unit          # Vitest unit tests (fast, no browser)
pnpm test:unit:watch    # unit tests in watch mode
pnpm test:unit:coverage # unit tests with coverage report
pnpm test               # Playwright E2E tests (headless)
pnpm test:ui            # visual test debugger
pnpm test:report        # open the last HTML test report
```

### Performance and bundle size

```bash
pnpm lighthouse    # build + run Lighthouse CI audit
pnpm analyze       # build with bundle visualiser
pnpm bundle-size   # check against bundle size budget
pnpm validate      # full CI run: build + check + bundle-size + lighthouse
```

Run `pnpm validate` locally before opening a large PR — it mirrors exactly what CI runs.

The E2E test suite (`tests/smoke/`, `tests/seo/`, `tests/a11y/`, `tests/layout/`, `tests/contact/`, `tests/performance/`) checks SEO tags, accessibility, nav links, contact form behavior, and static files — all of which should still pass after your UI changes.
