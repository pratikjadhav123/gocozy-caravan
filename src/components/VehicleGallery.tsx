"use client";

import Image from "next/image";
import { useState } from "react";
import { FaShare } from "react-icons/fa";
import { toast } from "sonner";

type GalleryImage = { src: string; alt: string };

type Props = {
  images: readonly GalleryImage[];
  shareTitle?: string;
  sharePath?: string;
};

export function VehicleGallery({ images, shareTitle, sharePath }: Props) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  const main = list[active] ?? list[0];

  if (!main) return null;

  async function shareVehicle() {
    const url =
      typeof window !== "undefined"
        ? new URL(sharePath || window.location.pathname, window.location.origin).toString()
        : sharePath || "";
    const title = shareTitle || "Go Cozy Caravan";

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url, text: title });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      } catch {
        toast.error("Could not share");
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0b121a] p-2 sm:p-2.5">
      <div className="grid gap-2 sm:gap-2.5 lg:grid-cols-[minmax(0,1.7fr)_minmax(148px,0.38fr)] lg:items-stretch">
        <div className="relative aspect-[16/11] min-h-[200px] overflow-hidden rounded-2xl border border-white/10 bg-charcoal sm:aspect-[16/10] sm:min-h-[240px] lg:aspect-auto lg:min-h-[300px] lg:max-h-[340px]">
          <Image
            src={main.src}
            alt={main.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 68vw"
            unoptimized={main.src.startsWith("/uploads/")}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
          <p className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-medium text-zinc-200 backdrop-blur-sm">
            {active + 1} / {list.length}
          </p>
          <button
            type="button"
            onClick={shareVehicle}
            className="btn-press absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition hover:border-gold/50 hover:text-gold"
            aria-label="Share this vehicle"
          >
            <FaShare className="h-4 w-4" />
          </button>
        </div>

        <div className="admin-sidebar-scroll grid max-h-[148px] grid-cols-4 gap-2 overflow-y-auto sm:max-h-[180px] sm:grid-cols-6 lg:max-h-[340px] lg:grid-cols-2 lg:gap-2">
          {list.map((img, index) => (
            <button
              key={`${img.src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition lg:aspect-[5/4] ${
                active === index
                  ? "border-gold ring-2 ring-gold/35"
                  : "border-white/10 hover:border-gold/45"
              }`}
              aria-label={`View photo ${index + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="110px"
                unoptimized={img.src.startsWith("/uploads/")}
              />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 px-1 text-xs text-zinc-500">
        {list.length} photos · tap thumbnails to preview
      </p>
    </div>
  );
}
