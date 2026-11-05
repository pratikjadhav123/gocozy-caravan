import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PICKUP_LOCATIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Locations",
  description: "Caravan pickup hubs across India — Pune, Mumbai, Delhi NCR, Bengaluru, and more.",
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        title="Caravan rental locations in India"
        subtitle="Pick up near you and head for the road — verified Go Cozy vehicles with WhatsApp booking support."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-white">Find a caravan near you</h2>
            <p className="mt-2 text-zinc-400">
              Each city hub lists pickup options and popular routes. Open a city for details, then
              book the van you want.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PICKUP_LOCATIONS.map((loc) => (
              <article
                key={loc.slug}
                className="card-hover flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={loc.image}
                    alt={`Caravan rental in ${loc.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                    {loc.status}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-white">{loc.name}</h2>
                  <p className="mt-2 flex-1 text-sm text-zinc-400">{loc.blurb}</p>
                  <p className="mt-3 text-xs text-zinc-500">
                    Popular: {loc.routes.slice(0, 3).join(" · ")}
                  </p>
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold py-2.5 text-sm font-bold text-charcoal transition hover:bg-gold-light"
                  >
                    Explore {loc.name}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white">
            Why book a caravan by location
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Closer pickup, earlier start",
                text: "Start rested near home or hotel instead of long empty transfers.",
              },
              {
                title: "Operators who know the routes",
                text: "Local timing tips for hills, coast, and desert seasons.",
              },
              {
                title: "Home or hotel delivery",
                text: "Doorstep / lobby handover available on request.",
              },
              {
                title: "Verified before you travel",
                text: "Walkthrough of lounge, AC, washroom, and kitchen options.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-charcoal-light p-5">
                <h3 className="font-semibold text-gold">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/10 px-6 py-10 text-center">
            <h2 className="font-display text-2xl font-bold text-white">Ready to book your caravan?</h2>
            <p className="mt-2 text-sm text-zinc-400">Start with Pune or Mumbai — or pick any live city.</p>
            <Link
              href="/locations/pune"
              className="mt-6 inline-flex rounded-full bg-gold px-8 py-3 text-sm font-bold text-charcoal transition hover:bg-gold-light"
            >
              Start with Pune
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
