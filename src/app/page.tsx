
import Image from "next/image";
import Link from "next/link";
import {
  AMENITIES,
  DESTINATIONS,
  SITE,
  VEHICLES,
  whatsappUrl,
} from "@/lib/constants";

export default function HomePage() {
  const wa = whatsappUrl(
    "Hi GoCozyCaravan, I want to check availability for a trip."
  );

  return (
    <>
      <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-van.svg"
            alt="Go Cozy Caravan luxury vehicle on the road"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {SITE.tagline}
          </p>

          <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Travel in comfort.
            <span className="block text-gold">
              Sleep under the stars.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-zinc-300">
            Fully equipped luxury caravans with lounge seating, AC,
            entertainment, and onboard bathroom — perfect for family
            holidays and weekend escapes from Pune.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/book"
              className="rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-charcoal transition hover:bg-gold-light"
            >
              Book Now
            </Link>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-charcoal-light py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
          {[
            {
              label: "Premium interiors",
              value: "Leather lounge & LED lighting",
            },
            {
              label: "Destinations",
              value: DESTINATIONS.slice(0, 4).join(" · ") + " …",
            },
            {
              label: "Support",
              value: "WhatsApp & email booking assistance",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center sm:text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                {item.label}
              </p>
              <p className="mt-2 break-words text-sm text-zinc-300">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">
                Our fleet
              </h2>
              <p className="mt-2 max-w-lg text-zinc-400">
                Choose a caravan sized for your group. All vehicles
                include driver options on request.
              </p>
            </div>

            <Link
              href="/vehicles"
              className="text-sm font-semibold text-gold hover:underline"
            >
              View all vehicles →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VEHICLES.map((vehicle) => (
              <article
                key={vehicle.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
              >
                <div className="relative aspect-[4/3] bg-zinc-800">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {vehicle.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {vehicle.seats} seats · {vehicle.beds} beds
                  </p>
                  <p className="mt-3 text-sm text-zinc-300">
                    {vehicle.highlight}
                  </p>
                  <Link
                    href="/book"
                    className="mt-4 inline-block text-sm font-semibold text-gold"
                  >
                    Check availability
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-charcoal-light py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white">
            Onboard amenities
          </h2>
          <p className="mt-2 text-zinc-400">
            Everything you need for a cozy journey.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITIES.map((a) => (
              <li
                key={a.title}
                className="rounded-xl border border-white/10 bg-charcoal/60 p-5"
              >
                <h3 className="font-semibold text-gold">{a.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {a.description}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="/amenities"
            className="mt-8 inline-block text-sm font-semibold text-gold hover:underline"
          >
            Explore amenities →
          </Link>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/gallery/interior-lounge-2.svg"
              alt="Luxury caravan interior with seating and lighting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-white">
              Ready to plan your trip?
            </h2>
            <p className="mt-4 text-zinc-400">
              Send your dates and group size — we will hold a slot
              and confirm pricing over WhatsApp or email.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-zinc-300">
              <li>Phone: {SITE.phoneDisplay}</li>
              <li>Email: {SITE.email}</li>
            </ul>

            <Link
              href="/book"
              className="mt-8 inline-flex rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-charcoal"
            >
              Book a slot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}