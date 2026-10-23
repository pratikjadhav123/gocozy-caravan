"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.svg"
            alt={`${SITE.name} logo`}
            width={140}
            height={48}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/book"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-gold-light"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-white/10 bg-charcoal lg:hidden"
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-zinc-200 hover:bg-white/5"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-gold py-3 text-center font-semibold text-charcoal"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
