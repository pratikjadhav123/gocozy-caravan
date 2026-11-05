"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/95 backdrop-blur-md"
      initial={reduce ? false : { y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease }}
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:gap-4 xl:gap-6">
        <Link
          href="/"
          className="logo-link relative z-10 flex min-w-0 shrink-0 items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          onClick={() => setOpen(false)}
        >
          <motion.span
            className="block"
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
          >
            <Image
              src="/images/logo-header.png"
              alt={`${SITE.name} logo`}
              width={744}
              height={160}
              className="h-9 w-auto max-w-[min(188px,58vw)] object-contain object-left sm:h-10 sm:max-w-[210px] lg:h-11 lg:max-w-[236px]"
              priority
            />
          </motion.span>
        </Link>

        <nav
          className="hidden items-center justify-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ href, label }, i) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <motion.div
                key={href}
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 + i * 0.04, ease }}
              >
                <Link
                  href={href}
                  className={`whitespace-nowrap rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors xl:px-2.5 xl:text-xs 2xl:px-3 2xl:text-sm ${
                    active
                      ? "bg-gold/15 text-gold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div
          className="hidden items-center justify-end gap-2 lg:flex"
          initial={reduce ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.35, ease }}
        >
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 px-3 py-2 text-sm text-zinc-300 transition hover:border-gold hover:text-gold"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <Link
            href="/book"
            className="btn-press rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-gold-light"
          >
            Book Now
          </Link>
        </motion.div>

        <button
          type="button"
          className="btn-press inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-xl border border-white/15 text-white transition hover:border-gold/50 hover:text-gold lg:hidden"
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

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="border-t border-white/10 bg-charcoal lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
          >
            <nav
              className="mx-auto flex max-h-[min(70dvh,520px)] max-w-6xl flex-col gap-1 overflow-y-auto px-4 py-4"
              aria-label="Mobile"
            >
              {NAV_LINKS.map(({ href, label }, index) => (
                <motion.div
                  key={href}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.04, ease }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3.5 text-base font-medium text-zinc-200 transition hover:bg-white/5 active:bg-gold/10"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 text-base font-medium text-zinc-200 hover:bg-white/5"
              >
                Instagram
              </a>
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="btn-press mt-2 rounded-full bg-gold py-3.5 text-center font-semibold text-charcoal"
              >
                Book your caravan
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
