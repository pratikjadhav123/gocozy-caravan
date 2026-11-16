import { HeroEditor } from "@/components/admin/HeroEditor";
import { listHeroSlides } from "@/lib/cms-home";

export default async function BannersPage() {
  let slides: Awaited<ReturnType<typeof listHeroSlides>> = [];
  let error = "";
  try {
    slides = await listHeroSlides();
  } catch {
    error = "Run: node scripts/migrate-home-sections.mjs";
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Homepage hero / slider banners — upload images and edit titles, highlights and captions.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <HeroEditor initial={slides} />
      )}
    </div>
  );
}
