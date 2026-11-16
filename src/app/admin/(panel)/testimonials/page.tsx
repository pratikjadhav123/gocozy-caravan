import { TestimonialsEditor } from "@/components/admin/TestimonialsEditor";
import { listTestimonials } from "@/lib/media-library";

export default async function TestimonialsAdminPage() {
  let items: Awaited<ReturnType<typeof listTestimonials>> = [];
  let error = "";
  try {
    items = await listTestimonials();
  } catch {
    error = "Run: node scripts/migrate-media-library.mjs";
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Customer reviews with name, rating, location and optional photo upload.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <TestimonialsEditor initial={items} />
      )}
    </div>
  );
}
