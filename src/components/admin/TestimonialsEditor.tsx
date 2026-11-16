"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Item = {
  id: number;
  slug: string;
  customer_name: string;
  rating: number;
  review: string;
  photo_url: string | null;
  location: string | null;
  sort_order: number;
  is_active: number;
};

export function TestimonialsEditor({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/testimonials", { method: "POST", body: form });
    const data = (await res.json()) as { ok: boolean; error?: string; slug?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save testimonial");
      return;
    }
    toast.success("Testimonial saved", { description: data.slug });
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete testimonial ${slug}?`)) return;
    const res = await fetch(`/api/admin/testimonials?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Could not delete");
      return;
    }
    toast.success("Testimonial deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        key={editing ? `edit-${editing.slug}` : "new-testimonial"}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <h3 className="font-display text-lg font-semibold text-white">
          {editing ? `Edit: ${editing.customer_name}` : "Add / update testimonial"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Customer name *</span>
            <input name="customer_name" className="input-field" required defaultValue={editing?.customer_name || ""} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Slug</span>
            <input name="slug" className="input-field" placeholder="auto" defaultValue={editing?.slug || ""} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Location</span>
            <input name="location" className="input-field" defaultValue={editing?.location || ""} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Rating (1–5)</span>
            <input name="rating" type="number" min={1} max={5} className="input-field" defaultValue={editing?.rating || 5} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Review *</span>
          <textarea name="review" className="input-field min-h-28 resize-y" required defaultValue={editing?.review || ""} />
        </label>
        <input type="hidden" name="photoUrl" value={editing?.photo_url || ""} />
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Customer photo (upload)</span>
          <input name="photo" type="file" accept="image/*" className="input-field" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal disabled:opacity-60">
            {busy ? "Saving…" : editing ? "Update" : "Save testimonial"}
          </button>
          {editing ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-300">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {initial.map((item) => (
          <article key={item.slug} className="rounded-2xl border border-white/10 bg-charcoal-light p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-zinc-800">
                {item.photo_url ? (
                  <Image src={item.photo_url} alt={item.customer_name} fill className="object-cover" unoptimized={item.photo_url.startsWith("/uploads/")} />
                ) : null}
              </div>
              <div>
                <p className="font-semibold text-white">{item.customer_name}</p>
                <p className="text-xs text-zinc-500">
                  {"★".repeat(item.rating)} {item.location ? `· ${item.location}` : ""}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-400">{item.review}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setEditing(item)} className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold">
                Edit
              </button>
              <button type="button" onClick={() => remove(item.slug)} className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-300">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
