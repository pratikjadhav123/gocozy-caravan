"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SITE } from "@/lib/constants";

const SLIDES = [
  {
    src: "/images/slider/slide-1.png",
    alt: "Go Cozy motorhome with outdoor seating",
    title: "Your Journey,",
    highlight: "Your Home On Wheels.",
    caption: "Luxury motorhomes & caravans for India road trips.",
  },
  {
    src: "/images/slider/slide-2.png",
    alt: "Go Cozy Karavan front view on the road",
    title: "Travel in comfort.",
    highlight: "Sleep under the stars.",
    caption: "Premium lounge, AC, and onboard bathroom ready.",
  },
  {
    src: "/images/slider/slide-3.png",
    alt: "Go Cozy Caravan side branding",
    title: "Go Cozy fleet.",
    highlight: "Built for the open road.",
    caption: "Caravan, kitchen caravan & Urbania for every group.",
  },
  {
    src: "/images/slider/slide-4.png",
    alt: "Go Cozy caravan night setup with awning",
    title: "Camp in style.",
    highlight: "Awning nights included.",
    caption: "Outdoor living with kitchen options on select vans.",
  },
  {
    src: "/images/fleet/urbania-hills.png",
    alt: "Go Cozy Urbania luxury van",
    title: "Groups travel big.",
    highlight: "Urbania 15–16 seats.",
    caption: "AC and smart sound for celebrations & tours.",
  },
  {
    src: "/images/fleet/urbania-palace.png",
    alt: "Go Cozy Urbania at heritage venue",
    title: "Arrive in style.",
    highlight: "Urbania for every occasion.",
    caption: "Temple trips, weddings, corporate outings — book on WhatsApp.",
  },
  {
    src: "/images/slider/slide-lifestyle.png",
    alt: "Caravan lifestyle by the lake",
    title: "Across all India.",
    highlight: "Hills · coast · desert.",
    caption: "Pick a destination — we confirm on WhatsApp.",
  },
] as const;

const INTERVAL_MS = 3000;
const ease = [0.22, 1, 0.36, 1] as const;

type HeroSliderProps = {
  whatsappHref: string;
};

export function HeroSlider({ whatsappHref }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(index + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [index, paused, go]);

  const slide = SLIDES[index];

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
      {SLIDES.map((item, i) => (
        <motion.div
          key={item.src}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.85, ease }}
          aria-hidden={i !== index}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority={i === 0}
            className={`object-cover object-center ${i === index && !reduce ? "hero-zoom" : ""}`}
            sizes="100vw"
          />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/25 sm:bg-gradient-to-r sm:from-charcoal sm:via-charcoal/80 sm:to-charcoal/30" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-16 pt-24 sm:gap-7 sm:px-6 sm:py-28 lg:py-32">
        <motion.p
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold sm:text-sm"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease }}
        >
          {SITE.tagline}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.h1
            key={slide.title}
            className="max-w-2xl font-display text-[2.35rem] font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease }}
          >
            {slide.title}
            <span className="mt-1 block text-gold">{slide.highlight}</span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={slide.caption}
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
            {SLIDES.map((item, i) => (
              <button
                key={item.src}
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
      </div>
    </section>
  );
}
