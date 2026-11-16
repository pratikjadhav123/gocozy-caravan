import { FleetEditor } from "@/components/admin/FleetEditor";
import { HomeFleetCardsEditor } from "@/components/admin/HomeFleetCardsEditor";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { listMedia, listTexts } from "@/lib/cms";
import { listCmsVehicles } from "@/lib/cms-content";

export default async function FleetAdminPage() {
  let vehicles: Awaited<ReturnType<typeof listCmsVehicles>> = [];
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let error = "";

  try {
    [vehicles, media, texts] = await Promise.all([
      listCmsVehicles(),
      listMedia("home_fleet"),
      listTexts(),
    ]);
  } catch {
    error = "Run: node scripts/migrate-cms-content.mjs && node scripts/migrate-home-sections.mjs";
  }

  const fleetTexts = texts.filter((t) => t.text_key.startsWith("home_fleet_"));

  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">
        Manage caravan fleet details, gallery uploads, and home-page fleet card images.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <>
          <section className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-white">Fleet vans</h3>
            <FleetEditor initial={vehicles} />
          </section>
          <section className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-white">Home fleet section</h3>
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
              media={media}
            />
          </section>
        </>
      )}
    </div>
  );
}
