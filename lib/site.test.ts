import { describe, expect, it } from "vitest";
import { createPageMetadata, site } from "./site";

describe("createPageMetadata", () => {
  it("sets the page title directly from site.pages", () => {
    const meta = createPageMetadata("about", "/about");
    expect(meta.title).toBe(site.pages.about.title);
  });

  it("sets the meta description from site.pages", () => {
    const meta = createPageMetadata("about", "/about");
    expect(meta.description).toBe(site.pages.about.description);
  });

  it("composes openGraph.title as '<page title> — <site name>'", () => {
    const meta = createPageMetadata("about", "/about");
    const expected = `${site.pages.about.title} — ${site.name}`;
    expect(meta.openGraph?.title).toBe(expected);
  });

  it("sets openGraph.url to the provided path", () => {
    const meta = createPageMetadata("services", "/services");
    expect(meta.openGraph?.url).toBe("/services");
  });

  it("sets the canonical URL to the provided path", () => {
    const meta = createPageMetadata("contact", "/contact");
    expect(meta.alternates?.canonical).toBe("/contact");
  });

  it("uses summary_large_image for the twitter card", () => {
    const meta = createPageMetadata("home", "/");
    expect((meta.twitter as { card?: string })?.card).toBe(
      "summary_large_image"
    );
  });

  it("includes the OG image with 1200x630 dimensions and site name alt", () => {
    const meta = createPageMetadata("home", "/");
    const images = meta.openGraph?.images as Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    expect(images[0].width).toBe(1200);
    expect(images[0].height).toBe(630);
    expect(images[0].alt).toBe(site.name);
  });

  it("propagates description into openGraph and twitter", () => {
    const meta = createPageMetadata("services", "/services");
    expect(meta.openGraph?.description).toBe(site.pages.services.description);
    expect(meta.twitter?.description).toBe(site.pages.services.description);
  });

  it.each([
    "home",
    "about",
    "services",
    "contact",
  ] as const)("produces complete metadata for page '%s'", (page) => {
    const path = page === "home" ? "/" : `/${page}`;
    const meta = createPageMetadata(page, path);
    expect(meta.title).toBeTruthy();
    expect(meta.description).toBeTruthy();
    expect(meta.alternates?.canonical).toBe(path);
    expect(meta.openGraph?.title).toBeTruthy();
    expect((meta.twitter as { card?: string })?.card).toBeTruthy();
  });
});
