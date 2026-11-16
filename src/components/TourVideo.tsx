"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  cta: string;
  videoUrl: string;
  badge: string;
  posterSrc: string;
};

function toEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      const embed = u.pathname.match(/\/embed\/([^/]+)/);
      if (embed?.[1]) return `https://www.youtube.com/embed/${embed[1]}?autoplay=1&rel=0`;
    }
    if (url.endsWith(".mp4") || url.endsWith(".webm")) return url;
    return url;
  } catch {
    return null;
  }
}

const ease = [0.22, 1, 0.36, 1] as const;

export function TourVideo({
  eyebrow,
  title,
  highlight,
  body,
  cta,
  videoUrl,
  badge,
  posterSrc,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const embed = useMemo(() => toEmbedUrl(videoUrl), [videoUrl]);
  const isDirect = Boolean(embed && (embed.endsWith(".mp4") || embed.endsWith(".webm")));

  return (
    <section className="border-t border-white/10 bg-[#0b1218] py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="on-dark">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              {eyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.12] text-white sm:text-5xl">
              {title}
              {highlight ? (
                <span className="mt-1 block font-accent text-[1.15em] font-normal italic text-gold">
                  {highlight}
                </span>
              ) : null}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
              {body}
            </p>
            <motion.button
              type="button"
              onClick={() => setPlaying(true)}
              disabled={!embed}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.25, ease }}
              className="btn-press mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cta}
              <span aria-hidden>↗</span>
            </motion.button>
            {!embed ? (
              <p className="mt-3 text-xs text-zinc-500">
                Add a YouTube URL in admin → Pages → Tour video.
              </p>
            ) : null}
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="on-dark relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[16/10]">
              {playing && embed ? (
                isDirect ? (
                  <video className="h-full w-full object-cover" src={embed} controls autoPlay playsInline />
                ) : (
                  <iframe
                    title={badge || "Caravan tour"}
                    src={embed}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <>
                  <Image
                    src={posterSrc}
                    alt={badge || "Caravan tour preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 50vw"
                    unoptimized={posterSrc.startsWith("/uploads/")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <button
                    type="button"
                    onClick={() => embed && setPlaying(true)}
                    disabled={!embed}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={cta}
                  >
                    <motion.span
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm"
                      animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M8 5.5v13l11-6.5L8 5.5z" />
                      </svg>
                    </motion.span>
                  </button>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                      {badge}
                    </p>
                    {embed ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                        Watch on YouTube ↗
                      </p>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
