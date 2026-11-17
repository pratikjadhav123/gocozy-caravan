import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ensureTexts, getMediaMap, getTextsMap, TESTIMONIAL_TEXT_DEFAULTS } from "@/lib/cms";
import { getTestimonialsForSite } from "@/lib/media-library";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await ensureTexts([...TESTIMONIAL_TEXT_DEFAULTS]).catch(() => undefined);

  const [media, texts, testimonials] = await Promise.all([
    getMediaMap("about"),
    getTextsMap(),
    getTestimonialsForSite(),
  ]);

  const title = texts.about_title || "About Go Cozy Caravan";
  const subtitle =
    texts.about_subtitle ||
    "Hotel-level comfort on the open road — curated for families, friends, and explorers across all India.";
  const body1 =
    texts.about_body_1 ||
    `${SITE.name} operates premium Force Traveller caravans and Urbania coaches customised with lounge seating, climate control, entertainment, kitchen options, and private bathroom facilities — so you can focus on the journey, not the logistics.`;
  const body2 =
    texts.about_body_2 ||
    "Based in Pune and serving travellers across India — from Lonavala and Goa to Manali, Rajasthan, Kerala, and beyond. Whether it is a weekend escape or a multi-day family tour, our team helps you pick the right vehicle and travel dates.";
  const body3 =
    texts.about_body_3 ||
    "Every booking is handled personally on WhatsApp. Follow our reels and trips on Instagram.";

  const hero = media.about_hero?.file_url || "/images/fleet/caravan-awning.png";
  const heroAlt = media.about_hero?.alt_text || "Go Cozy caravan outdoor setup";
  const main = media.about_main?.file_url || "/images/gallery/team-van.png";
  const mainAlt = media.about_main?.alt_text || "Go Cozy Caravan hosts with the branded luxury van";
  const interior = media.about_interior?.file_url || "/images/gallery/family-lounge.png";
  const interiorAlt = media.about_interior?.alt_text || "Family relaxing inside Go Cozy Caravan lounge";
  const exterior = media.about_exterior?.file_url || "/images/gallery/exterior-side-road.png";
  const exteriorAlt =
    media.about_exterior?.alt_text || "Go Cozy Caravan parked roadside with destination map wrap";

  return (
    <>
      <PageHero title={title} subtitle={subtitle} image={hero} imageAlt={heroAlt} />
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={main}
              alt={mainAlt}
              fill
              className="object-cover transition duration-700 hover:scale-105"
              sizes="(max-width:1024px) 100vw, 50vw"
              unoptimized={main.startsWith("/uploads/")}
            />
          </div>
          <div className="animate-fade-up space-y-4 text-zinc-300">
            <p>{body1}</p>
            <p>{body2}</p>
            <p>
              {body3} WhatsApp{" "}
              <strong className="text-gold">{SITE.phoneDisplay}</strong> or email{" "}
              <strong className="text-gold">{SITE.email}</strong>. Follow us on{" "}
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold hover:underline"
              >
                Instagram
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={interior}
              alt={interiorAlt}
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, 50vw"
              unoptimized={interior.startsWith("/uploads/")}
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={exterior}
              alt={exteriorAlt}
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, 50vw"
              unoptimized={exterior.startsWith("/uploads/")}
            />
          </div>
        </div>
      </section>

      <TestimonialsSection
        items={testimonials}
        title={texts.testimonials_title}
        subtitle={texts.testimonials_subtitle}
      />
    </>
  );
}
