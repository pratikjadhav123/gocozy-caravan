import { MediaLibraryPanel } from "@/components/admin/MediaLibraryPanel";
import { listMediaLibrary } from "@/lib/media-library";

export default async function MediaLibraryPage() {
  let items: Awaited<ReturnType<typeof listMediaLibrary>> = [];
  let error = "";
  try {
    items = await listMediaLibrary();
  } catch {
    error = "Media Library table missing. Run: node scripts/migrate-media-library.mjs";
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Central image library — upload, organize by category, edit title/alt text, search and delete.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <MediaLibraryPanel initial={items} />
      )}
    </div>
  );
}
