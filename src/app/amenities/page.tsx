import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AMENITIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Amenities",
};

const gallery = [
  { src: "/images/gallery/interior-lounge-1.svg", alt: "Lounge seating with LED ceiling" },
  { src: "/images/gallery/interior-bathroom.svg", alt: "Onboard bathroom with shower" },
  { src: "/images/gallery/interior-kitchen.svg", alt: "Kitchenette and storage" },
  { src: "/images/gallery/interior-bed.svg", alt: "Convertible sleeping area" },
];

export default function AmenitiesPage() {
  return (
    <>
      <PageHero
        title="Amenities"
        subtitle="Premium finishes, thoughtful storage, and modern conveniences — designed for long drives and overnight stays."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITIES.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-charcoal-light p-6"
              >
                <h2 className="font-display text-lg font-semibold text-gold">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.description}</p>
              </article>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-white">Inside the caravan</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {gallery.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
