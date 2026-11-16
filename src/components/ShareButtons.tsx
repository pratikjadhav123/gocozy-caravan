"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  title: string;
  path: string;
  className?: string;
};

function buildAbsoluteUrl(path: string) {
  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).toString();
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://gocozycaravan.com";
  return new URL(path, base).toString();
}

export function ShareButtons({ title, path, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => buildAbsoluteUrl(path), [path]);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.5 3.5A11 11 0 0 0 3.4 17.7L2 22l4.4-1.3A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.8.8-2.5-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.3 7.3 0 0 1-2.1-1.3 8 8 0 0 1-1.5-1.8c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3a2.4 2.4 0 0 0-.8 1.8 4.2 4.2 0 0 0 .9 2.2 9.6 9.6 0 0 0 3.7 3.5 12 12 0 0 0 1.3.5 3.1 3.1 0 0 0 1.4.1 2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c-.1-.1-.3-.2-.6-.3z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
        </svg>
      ),
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.9 2H22l-6.8 7.8L23 22h-6.5l-5.1-6.7L5.7 22H2.6l7.3-8.3L1 2h6.7l4.6 6.1L18.9 2zm-1.1 18h1.8L6.3 3.9H4.4L17.8 20z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.9 8.6H3.7V20h3.2V8.6zM5.3 4C4.2 4 3.3 4.9 3.3 6S4.2 8 5.3 8 7.3 7.1 7.3 6 6.4 4 5.3 4zM20.3 20h-3.2v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10V8.6h3.1v1.6h.1c.4-.8 1.5-1.8 3.1-1.8 3.3 0 3.9 2.2 3.9 5V20z" />
        </svg>
      ),
    },
  ] as const;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <div className={`rounded-2xl border border-white/10 bg-charcoal-light/70 p-4 sm:p-5 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Share this story</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition hover:border-gold/50 hover:text-gold"
          >
            {item.icon}
            {item.label}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="btn-press inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition hover:border-gold/50 hover:text-gold"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 9V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3M6 21h6a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
