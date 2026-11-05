import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { TRAVEL_DESTINATIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Caravan-friendly destinations across India — hills, beaches, desert, and more.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        title="Destinations across India"
        subtitle="Pick a route vibe — hills, coast, desert, or heritage — then book the Go Cozy van that fits your group."
        image="/images/slider/slide-lifestyle.png"
        imageAlt="Caravan travel destinations across India"
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRAVEL_DESTINATIONS.map((dest) => (
              <article
                key={dest.slug}
                className="card-hover overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 50vw, 33vw"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-charcoal">
                    {dest.status}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-gold">{dest.region}</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-white">{dest.name}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{dest.blurb}</p>
                  <p className="mt-3 text-xs text-zinc-500">
                    {dest.drive} · Ideal {dest.ideal}
                  </p>
                  <Link
                    href={`/book?destination=${encodeURIComponent(dest.name)}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold py-2.5 text-sm font-bold text-charcoal transition hover:bg-gold-light"
                  >
                    Explore & book
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-charcoal-light py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white">Why book by destination</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Route-matched vans",
                text: "Short weekends suit lounge caravans; longer loops love the kitchen unit.",
              },
              {
                title: "Local timing tips",
                text: "We help you avoid peak traffic and plan overnight halt windows.",
              },
              {
                title: "Pan-India coverage",
                text: "From Maharashtra classics to Rajasthan, Himachal, Kerala, and more.",
              },
              {
                title: "WhatsApp confirmation",
                text: "Share dates + destination — we confirm vehicle and pricing fast.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-charcoal/60 p-5">
                <h3 className="font-semibold text-gold">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-gold px-6 py-10 text-center text-charcoal">
            <h2 className="font-display text-2xl font-bold">Ready to book your caravan?</h2>
            <p className="mt-2 text-sm opacity-80">Pick a destination and tell us your dates on WhatsApp.</p>
            <Link
              href="/book"
              className="mt-6 inline-flex rounded-full bg-charcoal px-8 py-3 text-sm font-bold text-gold transition hover:scale-105"
            >
              Start booking
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
