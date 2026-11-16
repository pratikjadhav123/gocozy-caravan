"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Item = {
  id: number;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: number;
};

export function AmenitiesEditor({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/amenities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: String(form.get("slug") || ""),
        title: String(form.get("title") || ""),
        description: String(form.get("description") || ""),
        sort_order: Number(form.get("sort_order") || 0),
        is_active: true,
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; slug?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save amenity");
      return;
    }
    toast.success("Amenity saved", { description: data.slug });
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete amenity ${slug}?`)) return;
    const res = await fetch(`/api/admin/amenities?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Could not delete amenity");
      return;
    }
    toast.success("Amenity deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        key={editing ? `edit-${editing.slug}` : "new-amenity"}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <h3 className="font-display text-lg font-semibold text-white">
          {editing ? `Edit: ${editing.title}` : "Add / update amenity"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Title *</span>
            <input name="title" className="input-field" required defaultValue={editing?.title || ""} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Slug</span>
            <input name="slug" className="input-field" placeholder="auto" defaultValue={editing?.slug || ""} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Sort order</span>
            <input name="sort_order" type="number" className="input-field" defaultValue={editing?.sort_order ?? 0} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Description</span>
          <textarea name="description" className="input-field min-h-24 resize-y" defaultValue={editing?.description || ""} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal disabled:opacity-60">
            {busy ? "Saving…" : editing ? "Update" : "Save amenity"}
          </button>
          {editing ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-300">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {initial.map((item) => (
          <article key={item.slug} className="rounded-xl border border-white/10 bg-charcoal-light p-4">
            <p className="font-semibold text-gold">{item.title}</p>
            <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
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
