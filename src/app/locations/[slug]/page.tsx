import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PICKUP_LOCATIONS, getLocation } from "@/lib/content";
import { SITE } from "@/lib/constants";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PICKUP_LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return { title: "Location" };
  return {
    title: `Caravan rental in ${loc.name}`,
    description: loc.blurb,
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loc.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/55" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <nav className="text-sm text-zinc-400">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/locations" className="hover:text-gold">
              Locations
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-200">{loc.name}</span>
          </nav>
          <p className="mt-4 inline-flex rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
            {loc.badge}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">
            Caravan rental in {loc.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">{loc.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-full bg-gold px-7 py-3 text-sm font-bold text-charcoal transition hover:bg-gold-light"
            >
              Book now — browse fleet
            </Link>
            <Link
              href="/vehicles"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
            >
              View vehicles
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wide text-zinc-400">
            <span>WhatsApp booking</span>
            <span>{loc.routes.join(" · ")}</span>
            <span>Pickup across metro</span>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Why {loc.name} works for caravan trips
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loc.why.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-charcoal-light p-5"
              >
                <p className="text-3xl font-bold text-gold/80">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-charcoal-light py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white">
            Where you can pick up in {loc.name}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {loc.pickups.map((p, index) => (
              <div key={p.title} className="rounded-2xl border border-white/10 bg-charcoal/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                  Pickup {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{p.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-500">
            Exact pin is confirmed on WhatsApp at {SITE.phoneDisplay} when you reserve dates.
          </p>
        </div>
      </section>

      <FaqAccordion title={`FAQs for ${loc.name} pickups`} />
    </>
  );
}
