import Image from "next/image";
import Link from "next/link";
import { PICKUP_LOCATIONS, TRAVEL_DESTINATIONS } from "@/lib/content";
import { SITE, whatsappUrl } from "@/lib/constants";

export function Footer() {
  const wa = whatsappUrl("Hi GoCozyCaravan, I have a question about booking.");

  return (
    <footer className="site-footer relative overflow-hidden border-t border-white/10 text-zinc-400">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,185,35,0.14),_transparent_55%)]" />
        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Image
            src="/images/logo-header.png"
            alt={`${SITE.name} logo`}
            width={744}
            height={160}
            className="h-10 w-auto max-w-[220px] object-contain object-left sm:h-11 sm:max-w-[250px]"
          />
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{SITE.description}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500">{SITE.address}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold transition hover:bg-gold hover:text-charcoal"
            >
              WhatsApp
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-gold/50 hover:text-gold"
            >
              Instagram
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Explore</p>
          <div className="mt-2 h-0.5 w-10 rounded-full bg-gold/80" />
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/vehicles" prefetch={false} className="transition hover:text-gold">
                Our Fleet
              </Link>
            </li>
            <li>
              <Link href="/destinations" prefetch={false} className="transition hover:text-gold">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/locations" prefetch={false} className="transition hover:text-gold">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/blog" prefetch={false} className="transition hover:text-gold">
                Stories
              </Link>
            </li>
            <li>
              <Link href="/packages" prefetch={false} className="transition hover:text-gold">
                Packages
              </Link>
            </li>
            <li>
              <Link href="/book" prefetch={false} className="transition hover:text-gold">
                Book Now
              </Link>
            </li>
            <li>
              <Link href="/about" prefetch={false} className="transition hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" prefetch={false} className="transition hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Destinations</p>
          <div className="mt-2 h-0.5 w-10 rounded-full bg-gold/80" />
          <ul className="mt-4 space-y-2.5 text-sm">
            {TRAVEL_DESTINATIONS.slice(0, 6).map((d) => (
              <li key={d.slug}>
                <Link href="/destinations" prefetch={false} className="transition hover:text-gold">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">
            Locations & contact
          </p>
          <div className="mt-2 h-0.5 w-10 rounded-full bg-gold/80" />
          <ul className="mt-4 space-y-2.5 text-sm">
            {PICKUP_LOCATIONS.slice(0, 5).map((l) => (
              <li key={l.slug}>
                <Link href={`/locations/${l.slug}`} className="transition hover:text-gold">
                  {l.name}
                </Link>
              </li>
            ))}
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
                WhatsApp {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="transition hover:text-gold">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/25 py-4 text-center text-xs text-zinc-500 backdrop-blur-sm">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
