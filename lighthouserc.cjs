"use strict";
/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000",
        "http://localhost:3000/about",
        "http://localhost:3000/services",
        "http://localhost:3000/contact",
      ],
      startServerCommand: "pnpm start",
      startServerReadyPattern: "http://localhost:3000",
      startServerTimeout: 30_000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // ── Core Web Vitals (lab-measured, throttled by LHCI) ───────────────
        // Error-level: directly affect user experience and SEO ranking.
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        // Warn-level: TBT is the lab proxy for INP; noisier on CI runners.
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],

        // ── Category scores ─────────────────────────────────────────────────
        // SEO and accessibility are deterministic — hard fail on regressions.
        "categories:seo": ["error", { minScore: 1 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        // Performance category score is noisy on unthrottled CI — warn only;
        // rely on the individual CWV gates above for hard failures.
        "categories:performance": ["warn", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
