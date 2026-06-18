import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const socials = Object.entries(site.social).filter(([, url]) => url !== "");
  const year = new Date().getFullYear();

  return (
    <footer className="border-zinc-200 border-t bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            className="font-semibold text-black text-sm tracking-tight"
            href="/"
          >
            {site.name}
          </Link>
          <p className="text-sm text-zinc-500">{site.tagline}</p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-6">
            {site.nav.map(({ label, href }) => (
              <li key={href}>
                <Link
                  className="text-sm text-zinc-600 transition-colors hover:text-black"
                  href={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-zinc-200 border-t">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-xs text-zinc-500">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-zinc-500">
            Built by{" "}
            <a
              className="transition-colors hover:text-black"
              href={site.author.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {site.author.name}
            </a>
          </p>
          {socials.length > 0 && (
            <ul className="flex items-center gap-4">
              {socials.map(([platform, url]) => (
                <li key={platform}>
                  <a
                    className="text-xs text-zinc-500 capitalize transition-colors hover:text-black"
                    href={url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
