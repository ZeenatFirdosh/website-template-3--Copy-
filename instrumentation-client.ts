// biome-ignore-all lint: sentry auto-generated file
// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { captureRouterTransitionStart, init } from "@sentry/nextjs";

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

// Load Sentry Replay in a separate async chunk so the large @sentry-internal/replay
// module is tree-shaken from the main bundle. Deferred until after the browser is
// idle so the initialization work falls outside the [FCP → TTI] TBT window.
if (process.env.NODE_ENV === "production") {
  const loadReplay = () => void import("./instrumentation-client.replay");
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(loadReplay, { timeout: 5000 });
  } else {
    setTimeout(loadReplay, 0);
  }
}

export const onRouterTransitionStart = captureRouterTransitionStart;
