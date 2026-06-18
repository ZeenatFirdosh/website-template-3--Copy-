"use client";

import { ArrowRightIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          type="button"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-0" side="left">
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        {/* Header */}
        <div className="flex items-center border-border border-b px-5 py-4">
          <Link
            className="font-semibold text-foreground text-sm tracking-tight"
            href="/"
            onClick={close}
          >
            {site.name}
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          <p className="mb-1 px-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
            Menu
          </p>
          <ul className="flex flex-col">
            {site.nav.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    href={href}
                    onClick={close}
                  >
                    {label}
                    {isActive && (
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer CTA */}
        <div className="border-border border-t px-5 py-5">
          <p className="text-muted-foreground text-xs">{site.tagline}</p>
          <Link
            className="mt-3 inline-flex items-center gap-1.5 font-medium text-brand text-sm transition-colors hover:text-brand/80"
            href="/contact"
            onClick={close}
          >
            Start a project
            <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
