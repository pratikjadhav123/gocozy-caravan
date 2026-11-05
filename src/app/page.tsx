import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { Reveal } from "@/components/Reveal";
import {
  AMENITIES,
  SITE,
  VEHICLES,
  vehicleCapacityLabel,
  whatsappUrl,
} from "@/lib/constants";
import { TRAVEL_DESTINATIONS } from "@/lib/content";

const HOME_GALLERY = [
  { src: "/images/slider/slide-1.png", alt: "Go Cozy motorhome outdoor setup" },
  { src: "/images/slider/slide-2.png", alt: "Go Cozy Karavan front" },
  { src: "/images/slider/slide-3.png", alt: "Go Cozy Caravan side" },
  { src: "/images/fleet/caravan-night.png", alt: "Night caravan with kitchen" },
  { src: "/images/fleet/caravan-awning.png", alt: "Awning and outdoor living" },
  { src: "/images/fleet/urbania-hills.png", alt: "Go Cozy Urbania exterior" },
  { src: "/images/fleet/urbania-palace.png", alt: "Urbania at heritage venue" },
  { src: "/images/gallery/interior-lounge-1.png", alt: "Luxury lounge interior" },
  { src: "/images/gallery/family-lounge.png", alt: "Family lounge seating" },
] as const;

export default function HomePage() {
  const wa = whatsappUrl("Hi GoCozyCaravan, I want to check availability for a trip.");

  return (
    <>
      <HeroSlider whatsappHref={wa} />

      <section className="border-y border-white/10 bg-charcoal-light py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6">
          {[
            { label: "Premium interiors", value: "Leather lounge · LED · fridge" },
            { label: "All India", value: "Hills · beaches · desert · cities" },
            { label: "Easy booking", value: "WhatsApp · Instagram updates" },
          ].map((item, i) => (
            <Reveal key={item.label} delayMs={i * 80}>
              <div className="stat-chip text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-zinc-300">{item.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-white">Our fleet</h2>
                <p className="mt-2 max-w-lg text-zinc-400">
                  Two cozy caravans for families and Urbania for larger groups.
                </p>
              </div>
              <Link href="/vehicles" className="text-sm font-semibold text-gold hover:underline">
                View all vehicles →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-3">
            {VEHICLES.map((vehicle, i) => (
              <Reveal key={vehicle.id} delayMs={i * 100}>
                <article className="card-hover overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light">
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-zinc-800"
                  >
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="p-5">
                    <Link href={`/vehicles/${vehicle.id}`}>
                      <h3 className="font-display text-lg font-semibold text-white transition hover:text-gold">
                        {vehicle.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-zinc-400">{vehicleCapacityLabel(vehicle)}</p>
                    <p className="mt-3 text-sm text-zinc-300">{vehicle.highlight}</p>
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="mt-4 inline-block text-sm font-semibold text-gold transition hover:underline"
                    >
                      View details & availability →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-white">Fleet moments</h2>
                <p className="mt-2 text-zinc-400">Real Go Cozy vans — day trips, overnight stays & groups.</p>
              </div>
              <Link href="/vehicles" className="text-sm font-semibold text-gold hover:underline">
                See vehicles →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {HOME_GALLERY.map((img, i) => (
              <Reveal key={img.src} delayMs={i * 50}>
                <div
                  className={`relative overflow-hidden rounded-2xl border border-white/10 ${
                    i === 0 || i === 5 ? "aspect-[4/5] sm:aspect-[4/3]" : "aspect-square sm:aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(max-width:640px) 50vw, 25vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-charcoal-light py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold text-white">Popular destinations</h2>
                <p className="mt-2 text-zinc-400">Hills, beaches & desert — pick a vibe, then book.</p>
              </div>
              <Link href="/destinations" className="text-sm font-semibold text-gold hover:underline">
                All destinations →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRAVEL_DESTINATIONS.slice(0, 4).map((dest, i) => (
              <Reveal key={dest.slug} delayMs={i * 80}>
                <Link
                  href="/destinations"
                  className="card-hover group block overflow-hidden rounded-2xl border border-white/10 bg-charcoal"
                >
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width:1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-3 right-3 font-display text-lg font-semibold text-white">
                      {dest.name}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-white">Onboard amenities</h2>
            <p className="mt-2 text-zinc-400">Everything you need for a cozy journey across India.</p>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITIES.map((a, i) => (
              <Reveal key={a.title} delayMs={i * 60}>
                <li className="card-hover rounded-xl border border-white/10 bg-charcoal-light p-5">
                  <h3 className="font-semibold text-gold">{a.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{a.description}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <Link
              href="/amenities"
              className="mt-8 inline-block text-sm font-semibold text-gold hover:underline"
            >
              Explore amenities →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 pb-16 pt-4 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/gallery/interior-lounge-2.png"
                alt="Luxury caravan interior with seating and lighting"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delayMs={120}>
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Ready to plan your trip?</h2>
              <div className="gold-underline mt-4 w-24" />
              <p className="mt-4 text-zinc-400">
                Share dates and group size — we confirm pricing on WhatsApp. Follow journeys on
                Instagram too.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                <li>Phone: {SITE.phoneDisplay}</li>
                <li>Email: {SITE.email}</li>
                <li>
                  <a
                    href={SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    Instagram @gocozycaravan
                  </a>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/book"
                  className="btn-press inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-charcoal transition hover:bg-gold-light"
                >
                  Book a slot
                </Link>
                <Link
                  href="/locations"
                  className="btn-press inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
                >
                  Pickup locations
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
