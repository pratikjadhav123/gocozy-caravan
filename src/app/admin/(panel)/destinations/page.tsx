import { DestinationsEditor } from "@/components/admin/DestinationsEditor";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { listTexts } from "@/lib/cms";
import { listDestinations } from "@/lib/cms-home";

export default async function DestinationsAdminPage() {
  let destinations: Awaited<ReturnType<typeof listDestinations>> = [];
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let error = "";
  try {
    [destinations, texts] = await Promise.all([listDestinations(), listTexts()]);
  } catch {
    error = "Run: node scripts/migrate-home-sections.mjs";
  }

  const destTexts = texts.filter((t) => t.text_key.startsWith("home_dest_"));

  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">
        Popular destinations shown on the home page — upload photos and edit titles.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <>
          <TextsEditor initial={destTexts} />
          <DestinationsEditor initial={destinations} />
        </>
      )}
    </div>
  );
}
