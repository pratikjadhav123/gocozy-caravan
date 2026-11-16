import { SITE } from "@/lib/constants";

type OfficeLocationProps = {
  className?: string;
};

export function OfficeLocation({ className = "" }: OfficeLocationProps) {
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&z=16&output=embed`;

  return (
    <section className={`border-t border-white/10 bg-charcoal-light py-14 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Meet us / Plan your route
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Find us <span className="italic text-gold">in Pune.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400 lg:text-right">
            Based in Hinjawadi, Pune, Maharashtra. Open the map for our exact office location.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr] lg:items-stretch">
          <div className="rounded-2xl border border-white/10 bg-charcoal p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">Office address</p>
            <p className="mt-3 text-base leading-relaxed text-zinc-200">{SITE.address}</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-400">
              <li>Phone / WhatsApp: {SITE.phoneDisplay}</li>
              <li>Email: {SITE.email}</li>
            </ul>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal transition hover:bg-gold-light"
            >
              Open in Google Maps →
            </a>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 sm:min-h-[340px]">
            <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-charcoal/90 px-3 py-1.5 text-xs font-semibold text-gold backdrop-blur">
              Go Cozy Caravan — Pune
            </div>
            <iframe
              title="Go Cozy Caravan office location map"
              src={embedSrc}
              className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
