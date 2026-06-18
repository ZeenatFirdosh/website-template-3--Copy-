import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-zinc-200 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          className="font-semibold text-black text-sm tracking-tight"
          href="/"
        >
          {site.name}
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
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

        <div className="flex items-center gap-1">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
