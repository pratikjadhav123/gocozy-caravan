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
        subtitle="Hotel-level comfort on the open road — curated for families, friends, and explorers across all India."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/gallery/team-van.png"
              alt="Go Cozy Caravan hosts with the branded luxury van"
              fill
              className="object-cover transition duration-700 hover:scale-105"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div className="animate-fade-up space-y-4 text-zinc-300">
            <p>
              <strong className="text-white">{SITE.name}</strong> operates premium Force Traveller
              caravans and Urbaniya coaches customised with lounge seating, climate control,
              entertainment, kitchen options, and private bathroom facilities — so you can focus
              on the journey, not the logistics.
            </p>
            <p>
              Based in Pune and serving travellers across India — from Lonavala and Goa to Manali,
              Rajasthan, Kerala, and beyond. Whether it is a weekend escape or a multi-day family
              tour, our team helps you pick the right vehicle and travel dates.
            </p>
            <p>
              Every booking is handled personally on WhatsApp at{" "}
              <strong className="text-gold">{SITE.phoneDisplay}</strong> or email at{" "}
              <strong className="text-gold">{SITE.email}</strong>. Follow our reels and trips on{" "}
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold hover:underline"
              >
                Instagram
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/gallery/family-lounge.png"
              alt="Family relaxing inside Go Cozy Caravan lounge"
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/gallery/exterior-side-road.png"
              alt="Go Cozy Caravan parked roadside with destination map wrap"
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </>
  );
}
