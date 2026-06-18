// ============================================================
// SITE CONFIGURATION — edit this file to customize the template
// ============================================================

import type { Metadata } from "next";

export const site = {
  // ----------------------------------------------------------
  // Identity
  // ----------------------------------------------------------
  name: "Northbeam",
  tagline: "Growth Studio for Ambitious Brands",
  url: process.env.BASE_URL || "https://example.com",

  // ----------------------------------------------------------
  // SEO defaults (used by layout + OG/Twitter cards)
  // ----------------------------------------------------------
  description:
    "Northbeam is a growth studio helping ambitious brands launch faster, convert better, and scale with confidence.",
  keywords: [
    "growth studio",
    "marketing agency",
    "brand strategy",
    "web design",
    "conversion optimization",
  ],
  ogImage: "/og-image.png", // 1200×630 recommended

  // ----------------------------------------------------------
  // Author / company credit
  // ----------------------------------------------------------
  author: {
    name: "Fletten Labs",
    url: "https://fletten.com",
  },

  // ----------------------------------------------------------
  // Contact details
  // ----------------------------------------------------------
  contact: {
    email: "hello@northbeam.com",
    phone: "+1 (555) 000-0000",
    address: "123 Main Street, New York, NY 10001",
  },

  // ----------------------------------------------------------
  // Social links (set to "" to hide)
  // ----------------------------------------------------------
  social: {
    twitter: "https://twitter.com/northbeam",
    linkedin: "https://linkedin.com/company/northbeam",
    instagram: "",
    facebook: "",
  },

  // ----------------------------------------------------------
  // Navigation
  // ----------------------------------------------------------
  nav: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],

  // ----------------------------------------------------------
  // Per-page metadata
  // ----------------------------------------------------------
  pages: {
    home: {
      title: "Northbeam — Growth Studio for Ambitious Brands",
      description:
        "Northbeam is a growth studio helping ambitious brands launch faster, convert better, and scale with confidence.",
    },
    about: {
      title: "About",
      description:
        "Northbeam is a growth studio built by strategists, designers, and engineers obsessed with measurable outcomes.",
    },
    services: {
      title: "Services",
      description:
        "From brand strategy to web design to performance marketing — explore the full range of what Northbeam offers.",
    },
    contact: {
      title: "Contact",
      description:
        "Tell us about your project. We typically reply within one business day. Let's build something worth talking about.",
    },
  },
} as const;

export function createPageMetadata(
  page: keyof typeof site.pages,
  path: string
): Metadata {
  const { title, description } = site.pages[page];
  const fullTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title: fullTitle,
      description,
      url: path,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [site.ogImage],
    },
  };
}
