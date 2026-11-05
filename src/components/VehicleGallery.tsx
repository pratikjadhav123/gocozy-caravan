"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = { src: string; alt: string };

export function VehicleGallery({ images }: { images: readonly GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];
  const thumbs = images.slice(0, 5);

  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light">
        <Image
          src={main.src}
          alt={main.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 60vw"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        {thumbs.map((img, index) => (
          <button
            key={`${img.src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition ${
              active === index
                ? "border-gold ring-2 ring-gold/40"
                : "border-white/10 hover:border-gold/50"
            }`}
            aria-label={`View photo ${index + 1}`}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="20vw" />
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-500 lg:col-span-2">
        {images.length} photos · tap thumbnails to preview
      </p>
    </div>
  );
}
