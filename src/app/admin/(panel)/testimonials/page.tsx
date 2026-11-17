import { TestimonialsEditor } from "@/components/admin/TestimonialsEditor";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { ensureTexts, listTexts, TESTIMONIAL_TEXT_DEFAULTS } from "@/lib/cms";
import { listTestimonials } from "@/lib/media-library";

export default async function TestimonialsAdminPage() {
  let items: Awaited<ReturnType<typeof listTestimonials>> = [];
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let error = "";
  try {
    await ensureTexts([...TESTIMONIAL_TEXT_DEFAULTS]);
    [items, texts] = await Promise.all([listTestimonials(), listTexts()]);
  } catch {
    error = "Run: node scripts/migrate-media-library.mjs && node scripts/migrate-cms.mjs";
  }

  const sectionTexts = texts.filter((t) => t.text_key.startsWith("testimonials_"));

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Edit the section title/subtitle and manage customer reviews (name, rating, location, photo).
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <>
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-white">Section heading</h2>
            <TextsEditor initial={sectionTexts} />
          </div>
          <TestimonialsEditor initial={items} />
        </>
      )}
    </div>
  );
}
