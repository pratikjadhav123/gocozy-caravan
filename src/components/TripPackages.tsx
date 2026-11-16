import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getPackagesForSite, getTextsMap } from "@/lib/cms";
import { whatsappUrl } from "@/lib/constants";

export async function TripPackages() {
  const [packages, texts] = await Promise.all([getPackagesForSite(), getTextsMap()]);
  const eyebrow = texts.packages_eyebrow || "Clear options, custom journeys";
  const title = texts.packages_title || "Choose your way to explore.";
  const subtitle =
    texts.packages_subtitle ||
    "Share your route and schedule with us. We'll help confirm the best option for your trip.";

  return (
    <section className="border-t border-white/10 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                {title}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400 lg:text-right">{subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delayMs={i * 100}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal-light p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  {pkg.option}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-white">{pkg.title}</h3>
                <p className="mt-4 font-display text-3xl font-bold text-white">
                  {pkg.price}
                  <span className="ml-1 text-base font-medium text-zinc-400">{pkg.unit}</span>
                </p>
                <p className="mt-3 text-sm text-zinc-400">{pkg.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-gold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-zinc-500">Not included: {pkg.excludes}</p>
                <a
                  href={whatsappUrl(pkg.waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-6 text-sm font-semibold text-gold transition hover:underline"
                >
                  {pkg.cta} →
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-zinc-500">
          Confirm final pricing, route distance, taxes, trip conditions and additional charges with
          the team before booking.{" "}
          <Link href="/book" className="text-gold hover:underline">
            Book now
          </Link>
        </p>
      </div>
    </section>
  );
}
