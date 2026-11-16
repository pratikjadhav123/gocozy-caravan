"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type HeroSlideView = {
  slug: string;
  eyebrow: string;
  title: string;
  highlight: string;
  caption: string;
  image: string;
  alt: string;
};

const INTERVAL_MS = 3000;
const ease = [0.22, 1, 0.36, 1] as const;

type HeroSliderProps = {
  whatsappHref: string;
  slides: HeroSlideView[];
};

export function HeroSlider({ whatsappHref, slides }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const list = slides.length ? slides : [];

  const go = useCallback(
    (next: number) => {
      if (!list.length) return;
      setIndex((next + list.length) % list.length);
    },
    [list.length]
  );

  useEffect(() => {
    if (paused || list.length < 2) return;
    const id = window.setInterval(() => go(index + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [index, paused, go, list.length]);

  if (!list.length) return null;

  const slide = list[index] || list[0];

  return (
    <section
      className="relative flex h-[calc(100dvh-4rem)] max-h-[920px] min-h-[520px] items-end overflow-hidden sm:h-[calc(100dvh-4.25rem)] sm:items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Go Cozy highlights"
    >
      {list.map((item, i) => (
        <motion.div
          key={item.slug}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.85, ease }}
          aria-hidden={i !== index}
        >
          <Image
            src={item.image}
            alt={item.alt}
            fill
            priority={i === 0}
            className={`object-cover object-center ${i === index && !reduce ? "hero-zoom" : ""}`}
            sizes="100vw"
            unoptimized={item.image.startsWith("/uploads/")}
          />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25 sm:bg-gradient-to-r sm:from-black sm:via-black/75 sm:to-black/25" />

      <div className="on-dark relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-16 pt-24 sm:gap-7 sm:px-6 sm:py-28 lg:py-32">
        <AnimatePresence mode="wait">
          <motion.p
            key={`eyebrow-${slide.slug}`}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold sm:text-sm"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            {slide.eyebrow}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={slide.slug + slide.title}
            className="max-w-2xl font-display text-[2.35rem] font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease }}
          >
            {slide.title}
            {slide.highlight ? (
              <span className="mt-1 block font-accent text-[0.92em] font-normal italic text-gold">
                {slide.highlight}
              </span>
            ) : null}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={slide.slug + slide.caption}
            className="max-w-xl text-[0.95rem] leading-relaxed text-zinc-300 sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease }}
          >
            {slide.caption}
          </motion.p>
        </AnimatePresence>

        <motion.div
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease }}
        >
          <Link
            href="/book"
            className="btn-press rounded-full bg-gold px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-charcoal transition hover:bg-gold-light"
          >
            Book Now
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press rounded-full border border-white/30 px-8 py-3.5 text-center text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
          >
            WhatsApp us
          </a>
          <Link
            href="/vehicles"
            className="btn-press rounded-full border border-white/20 px-8 py-3.5 text-center text-sm font-semibold text-zinc-200 transition hover:border-gold hover:text-gold"
          >
            View fleet
          </Link>
        </motion.div>

        {list.length > 1 ? (
          <motion.div
            className="mt-2 flex items-center gap-3 sm:mt-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease }}
          >
            <button
              type="button"
              className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-gold hover:text-gold"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
            >
              ‹
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Slides">
              {list.map((item, i) => (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-gold" : "w-2 bg-white/35 hover:bg-white/60"
                  }`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-gold hover:text-gold"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
            >
              ›
            </button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
