"use client";

import { FaShare } from "react-icons/fa";
import { toast } from "sonner";

type Props = {
  title: string;
  path: string;
};

export function BlogCardShare({ title, path }: Props) {
  async function onShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const url =
      typeof window !== "undefined"
        ? new URL(path, window.location.origin).toString()
        : path;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, url, text: title });
        return;
      }
    } catch {
      /* user cancelled or share failed — fall through to copy */
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to share");
    } catch {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label={`Share ${title}`}
      title="Share"
      className="btn-press absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white text-[#152433] shadow-lg transition hover:bg-gold hover:text-charcoal"
    >
      <FaShare className="h-4 w-4" />
    </button>
  );
}
