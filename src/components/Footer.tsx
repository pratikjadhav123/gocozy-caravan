import Image from "next/image";
import Link from "next/link";
import { PICKUP_LOCATIONS, TRAVEL_DESTINATIONS } from "@/lib/content";
import { SITE, whatsappUrl } from "@/lib/constants";

export function Footer() {
  const wa = whatsappUrl("Hi GoCozyCaravan, I have a question about booking.");

  return (
    <footer className="border-t border-white/10 bg-charcoal text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/logo-header.png"
            alt={`${SITE.name} logo`}
            width={744}
            height={160}
            className="h-10 w-auto max-w-[220px] object-contain object-left sm:h-11 sm:max-w-[250px]"
          />
          <p className="mt-4 text-sm leading-relaxed">{SITE.description}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/vehicles" className="transition hover:text-gold">
                Our Fleet
              </Link>
            </li>
            <li>
              <Link href="/destinations" className="transition hover:text-gold">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/locations" className="transition hover:text-gold">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/blog" className="transition hover:text-gold">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/book" className="transition hover:text-gold">
                Book Now
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            Destinations
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {TRAVEL_DESTINATIONS.slice(0, 6).map((d) => (
              <li key={d.slug}>
                <Link href="/destinations" className="transition hover:text-gold">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            Locations & contact
          </p>
          <ul className="mt-3 space-y-2 text-sm">
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
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-gold"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
