import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/PageHero";
import { VEHICLES, vehicleCapacityLabel } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Fleet",
};

export default function VehiclesPage() {
  return (
    <>
      <PageHero
        title="Our fleet"
        subtitle="Three vehicles for India trips — open any van for photos, specs, and Check availability to book that unit."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
          {VEHICLES.map((vehicle, index) => (
            <article
              key={vehicle.id}
              className={`grid gap-8 lg:grid-cols-2 lg:items-center ${
                index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <Link
                href={`/vehicles/${vehicle.id}`}
                className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </Link>
              <div className="animate-fade-up">
                <h2 className="font-display text-2xl font-bold text-white">{vehicle.name}</h2>
                <p className="mt-2 text-gold">{vehicleCapacityLabel(vehicle)}</p>
                <p className="mt-4 text-zinc-400">{vehicle.highlight}</p>
                <ul className="mt-4 list-inside list-disc text-sm text-zinc-400">
                  <li>Professional chauffeur available</li>
                  <li>Flexible pick-up across India</li>
                  <li>Insurance & roadside assistance on trips</li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-bold text-charcoal transition hover:bg-gold-light hover:scale-105"
                  >
                    View details
                  </Link>
                  <Link
                    href={`/book?vehicle=${vehicle.id}`}
                    className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
                  >
                    Check availability
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/hero-van-side.png"
              alt="Go Cozy Caravan exterior with destination map wrap"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>
      <FaqAccordion />
    </>
  );
}
