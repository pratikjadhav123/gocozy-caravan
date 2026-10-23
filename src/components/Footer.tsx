import Link from "next/link";
import { NAV_LINKS, SITE, whatsappUrl } from "@/lib/constants";

export function Footer() {
  const wa = whatsappUrl("Hi GoCozyCaravan, I have a question about booking.");

  return (
    <footer className="border-t border-white/10 bg-charcoal text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-gold">{SITE.name}</p>
          <p className="mt-2 text-sm leading-relaxed">{SITE.description}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            Quick links
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                WhatsApp {SITE.phoneDisplay}
              </a>
            </li>
            <li>{SITE.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
