import Image from "next/image";
import Link from "next/link";
import { getTextsMap } from "@/lib/cms";
import { PICKUP_LOCATIONS, TRAVEL_DESTINATIONS } from "@/lib/content";
import { SITE, whatsappUrl } from "@/lib/constants";

export async function Footer() {
  const wa = whatsappUrl("Hi GoCozyCaravan, I have a question about booking.");
  const texts = await getTextsMap();
  const blurb = texts.footer_blurb || SITE.description;

  return (
    <footer className="site-footer relative overflow-hidden text-zinc-400">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(232,185,35,0.08),transparent_40%,rgba(56,189,248,0.06))]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-gold/20 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[110px]" />
        <div className="absolute left-1/2 top-0 h-px w-[min(90%,720px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent" />
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
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{blurb}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500">{SITE.address}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1.5 text-xs font-semibold text-gold shadow-[0_0_24px_rgba(232,185,35,0.15)] transition hover:bg-gold hover:text-charcoal"
            >
              WhatsApp
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 backdrop-blur transition hover:border-gold/50 hover:text-gold"
            >
              Instagram
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Explore</p>
          <div className="mt-2 h-0.5 w-10 rounded-full bg-gradient-to-r from-gold to-transparent" />
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
          <div className="mt-2 h-0.5 w-10 rounded-full bg-gradient-to-r from-gold to-transparent" />
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
          <div className="mt-2 h-0.5 w-10 rounded-full bg-gradient-to-r from-gold to-transparent" />
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

      <div className="relative border-t border-white/10 bg-black/35 py-4 text-center text-xs text-zinc-500 backdrop-blur-md">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
