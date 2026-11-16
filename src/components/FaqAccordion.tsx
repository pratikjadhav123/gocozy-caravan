"use client";

import { useState } from "react";

type FaqAccordionProps = {
  items: readonly { q: string; a: string }[];
  title?: string;
  subtitle?: string;
};

export function FaqAccordion({
  items,
  title = "Frequently asked questions",
  subtitle = "Straight answers before you book your trip.",
}: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <section className="border-t border-white/10 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">FAQ</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-zinc-400">{subtitle}</p> : null}
        <ul className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light/60 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <li key={`${item.q}-${index}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-gold transition ${
                      isOpen ? "rotate-45 bg-gold/15" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
