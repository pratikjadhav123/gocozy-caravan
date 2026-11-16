import { MediaUploader } from "@/components/admin/MediaUploader";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { listMedia, listTexts } from "@/lib/cms";

export default async function GalleryAdminPage() {
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let error = "";
  try {
    [media, texts] = await Promise.all([listMedia("home_gallery"), listTexts()]);
  } catch {
    error = "Run: node scripts/migrate-home-sections.mjs";
  }

  const galleryTexts = texts.filter((t) => t.text_key.startsWith("home_gallery_"));

  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">
        Fleet moments / travel gallery on the home page. Upload images (no URL paste).
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <>
          <TextsEditor initial={galleryTexts} />
          <MediaUploader items={media} />
        </>
      )}
    </div>
  );
}
