import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export type TestimonialView = {
  slug: string;
  customer_name: string;
  rating: number;
  review: string;
  photo_url: string | null;
  location: string | null;
};

export function TestimonialsSection({
  items,
  title = "What travellers say",
  subtitle = "Real feedback from families and groups who travelled with Go Cozy.",
}: {
  items: TestimonialView[];
  title?: string;
  subtitle?: string;
}) {
  if (!items.length) return null;

  return (
    <section className="border-t border-white/10 bg-charcoal-light py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">{subtitle}</p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.slug} delayMs={i * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal p-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/30 bg-zinc-800">
                    {item.photo_url ? (
                      <Image
                        src={item.photo_url}
                        alt={item.customer_name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={item.photo_url.startsWith("/uploads/")}
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-bold text-gold">
                        {item.customer_name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{item.customer_name}</p>
                    <p className="text-xs text-zinc-500">
                      <span className="text-gold">{"★".repeat(Math.max(1, Math.min(5, item.rating)))}</span>
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
                  “{item.review}”
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
