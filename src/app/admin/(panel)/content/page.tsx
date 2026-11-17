import { AmenitiesEditor } from "@/components/admin/AmenitiesEditor";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { ContentTabs } from "@/components/admin/ContentTabs";
import { DestinationsEditor } from "@/components/admin/DestinationsEditor";
import { FleetEditor } from "@/components/admin/FleetEditor";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { HomeFleetCardsEditor } from "@/components/admin/HomeFleetCardsEditor";
import { HomeSubTabs } from "@/components/admin/HomeSubTabs";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { listMedia, listTexts } from "@/lib/cms";
import { listCmsBlogPosts, listCmsVehicles } from "@/lib/cms-content";
import { listAmenities, listDestinations, listHeroSlides } from "@/lib/cms-home";

type PageProps = {
  searchParams: Promise<{ tab?: string; section?: string }>;
};

const HOME_SECTIONS = ["hero", "fleet", "gallery", "destinations", "amenities", "about"] as const;

export default async function AdminContentPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tab = ["home", "fleet", "blog"].includes(sp.tab || "") ? (sp.tab as string) : "home";
  const section = HOME_SECTIONS.includes(sp.section as (typeof HOME_SECTIONS)[number])
    ? (sp.section as string)
    : "hero";

  let error = "";
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let vehicles: Awaited<ReturnType<typeof listCmsVehicles>> = [];
  let posts: Awaited<ReturnType<typeof listCmsBlogPosts>> = [];
  let heroSlides: Awaited<ReturnType<typeof listHeroSlides>> = [];
  let destinations: Awaited<ReturnType<typeof listDestinations>> = [];
  let amenities: Awaited<ReturnType<typeof listAmenities>> = [];

  try {
    if (tab === "home") {
      if (section === "hero") {
        heroSlides = await listHeroSlides();
      } else if (section === "fleet") {
        [vehicles, media, texts] = await Promise.all([
          listCmsVehicles(true),
          listMedia("home_fleet"),
          listTexts(),
        ]);
      } else if (section === "gallery") {
        [media, texts] = await Promise.all([listMedia("home_gallery"), listTexts()]);
      } else if (section === "destinations") {
        [destinations, texts] = await Promise.all([listDestinations(), listTexts()]);
      } else if (section === "amenities") {
        [amenities, texts] = await Promise.all([listAmenities(), listTexts()]);
      } else if (section === "about") {
        [media, texts] = await Promise.all([listMedia("about"), listTexts()]);
      }
    } else if (tab === "fleet") {
      vehicles = await listCmsVehicles();
    } else if (tab === "blog") {
      posts = await listCmsBlogPosts();
    }
  } catch {
    error =
      "CMS tables missing. Run: node scripts/migrate-cms.mjs && node scripts/migrate-cms-content.mjs && node scripts/migrate-home-sections.mjs";
  }

  const fleetTexts = texts.filter((t) => t.text_key.startsWith("home_fleet_"));
  const galleryTexts = texts.filter((t) => t.text_key.startsWith("home_gallery_"));
  const destTexts = texts.filter((t) => t.text_key.startsWith("home_dest_"));
  const amenityTexts = texts.filter((t) => t.text_key.startsWith("home_amenities_"));
  const aboutTexts = texts.filter((t) => t.text_key.startsWith("about_"));
  const homeFleetMedia = media.filter((m) => m.section === "home_fleet");
  const galleryMedia = media.filter((m) => m.section === "home_gallery");
  const aboutMedia = media.filter((m) => m.section === "about");

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Fully dynamic website content. Home has separate sections — Hero, Fleet, Gallery,
        Destinations, Amenities, About.
      </p>

      <ContentTabs active={tab} />

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {!error && tab === "home" ? (
        <div className="space-y-6">
          <HomeSubTabs active={section} />

          {section === "hero" ? <HeroEditor initial={heroSlides} /> : null}

          {section === "fleet" ? (
            <div className="space-y-8">
              <TextsEditor initial={fleetTexts} />
              <HomeFleetCardsEditor
                vehicles={vehicles.map((v) => ({
                  slug: v.slug,
                  name: v.name,
                  seats: v.seats,
                  beds: v.beds,
                  highlight: v.highlight,
                  image: v.image,
                }))}
                media={homeFleetMedia}
              />
            </div>
          ) : null}

          {section === "gallery" ? (
            <div className="space-y-8">
              <TextsEditor initial={galleryTexts} />
              <MediaUploader items={galleryMedia} />
            </div>
          ) : null}

          {section === "destinations" ? (
            <div className="space-y-8">
              <TextsEditor initial={destTexts} />
              <DestinationsEditor initial={destinations} />
            </div>
          ) : null}

          {section === "amenities" ? (
            <div className="space-y-8">
              <TextsEditor initial={amenityTexts} />
              <AmenitiesEditor initial={amenities} />
            </div>
          ) : null}

          {section === "about" ? (
            <div className="space-y-8">
              <TextsEditor initial={aboutTexts} />
              <MediaUploader items={aboutMedia} />
            </div>
          ) : null}
        </div>
      ) : null}

      {!error && tab === "fleet" ? <FleetEditor initial={vehicles} /> : null}

      {!error && tab === "blog" ? <BlogEditor initial={posts} /> : null}
    </div>
  );
}
