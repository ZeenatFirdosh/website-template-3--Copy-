import { expect, test } from "@playwright/test";
import { site } from "../../lib/site";

// Static-file checks use the `request` fixture — no browser rendering involved.
// Scoping to Chromium avoids running the same HTTP requests 5× for zero added signal.
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Static-file checks are browser-agnostic — Chromium only"
);

const IMAGE_CONTENT_TYPE_RE = /^image\//;

test.describe("favicon", () => {
  test("returns HTTP 200", async ({ request }) => {
    const res = await request.get("/favicon.ico");
    expect(res.status()).toBe(200);
  });
});

test.describe("og:image", () => {
  // Fetch once and share across the three assertions to avoid triple round-trips.
  let ogImageStatus = 0;
  let ogImageContentType = "";
  let ogImageBuffer = Buffer.alloc(0);

  test.beforeAll(async ({ request }) => {
    const res = await request.get(site.ogImage);
    ogImageStatus = res.status();
    ogImageContentType = res.headers()["content-type"] ?? "";
    ogImageBuffer = Buffer.from(await res.body());
  });

  test("returns HTTP 200", () => {
    expect(ogImageStatus).toBe(200);
  });

  test("has an image content-type", () => {
    expect(ogImageContentType).toMatch(IMAGE_CONTENT_TYPE_RE);
  });

  test("is 1200×630 pixels (PNG IHDR)", () => {
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      ogImageBuffer[0] === 0x89 &&
      ogImageBuffer[1] === 0x50 &&
      ogImageBuffer[2] === 0x4e &&
      ogImageBuffer[3] === 0x47;
    expect(isPng).toBe(true);
    // IHDR chunk starts at byte 16; width at 16–19, height at 20–23
    const width = ogImageBuffer.readUInt32BE(16);
    const height = ogImageBuffer.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });
});

test.describe("sitemap.xml", () => {
  test("returns HTTP 200", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
  });

  test("lists all routes from site.nav", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    const body = await res.text();
    for (const route of ["/", ...site.nav.map(({ href }) => href)]) {
      expect(body).toContain(route);
    }
  });
});

test.describe("robots.txt", () => {
  test("returns HTTP 200", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
  });

  test("allows crawling", async ({ request }) => {
    const res = await request.get("/robots.txt");
    const body = await res.text();
    expect(body).toContain("Allow: /");
  });
});
