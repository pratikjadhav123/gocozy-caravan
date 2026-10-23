import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Go Cozy Caravan"
        subtitle="We bring hotel-level comfort to the open road — curated for families, friends, and explorers across Maharashtra."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/gallery/team-van.jpg"
              alt="Go Cozy Caravan team with luxury van"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-4 text-zinc-300">
            <p>
              <strong className="text-white">{SITE.name}</strong> operates premium Force Traveller
              caravans customised with lounge seating, climate control, entertainment, and private
              bathroom facilities — so you can focus on the journey, not the logistics.
            </p>
            <p>
              Based in Pune, we serve popular routes to Lonavala, Mahabaleshwar, Alibaug, Goa,
              and beyond. Whether it is a weekend picnic or a multi-day family tour, our team helps
              you pick the right vehicle and travel dates.
            </p>
            <p>
              Every booking is handled personally: share your slot request online, and we confirm
              availability via WhatsApp at <strong className="text-gold">{SITE.phoneDisplay}</strong>{" "}
              or email at <strong className="text-gold">{SITE.email}</strong>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
