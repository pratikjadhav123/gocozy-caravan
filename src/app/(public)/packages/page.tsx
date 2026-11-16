import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { TripPackages } from "@/components/TripPackages";
import { getMediaBySlot } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Go Cozy 1-day trip package and KM-wise charges for caravan travel across India.",
};

export default async function PackagesPage() {
  let hero = "/images/slider/slide-1.png";
  let alt = "Go Cozy trip packages";
  try {
    const media = await getMediaBySlot("packages_hero");
    if (media?.file_url) {
      hero = media.file_url;
      alt = media.alt_text || alt;
    }
  } catch {
    // fallback
  }

  return (
    <>
      <PageHero
        title="Trip packages"
        subtitle="Clear day-trip and KM-wise options — confirm your route on WhatsApp."
        image={hero}
        imageAlt={alt}
      />
      <TripPackages />
    </>
  );
}
