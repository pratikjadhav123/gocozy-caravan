import { MediaUploader } from "@/components/admin/MediaUploader";
import { listMedia } from "@/lib/cms";

export default async function AdminMediaPage() {
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  let error = "";
  try {
    media = await listMedia();
  } catch {
    error = "CMS tables missing. Run in terminal: node scripts/migrate-cms.mjs";
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Upload dynamic images for Home fleet, gallery, and blog hero. Slot names are fixed so the
        website picks them up automatically.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <MediaUploader items={media} />
      )}
    </div>
  );
}
