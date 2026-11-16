"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Item = {
  id: number;
  slug: string;
  name: string;
  blurb: string | null;
  image: string;
  sort_order: number;
  show_on_home: number;
  is_active: number;
};

export function DestinationsEditor({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/destinations", { method: "POST", body: form });
    const data = (await res.json()) as { ok: boolean; error?: string; slug?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save destination");
      return;
    }
    toast.success("Destination saved", { description: data.slug });
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete destination ${slug}?`)) return;
    const res = await fetch(`/api/admin/destinations?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Could not delete destination");
      return;
    }
    toast.success("Destination deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        key={editing ? `edit-${editing.slug}` : "new-dest"}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <h3 className="font-display text-lg font-semibold text-white">
          {editing ? `Edit: ${editing.name}` : "Add / update destination"}
        </h3>
        <p className="text-xs text-zinc-500">Upload card image for Popular destinations on home.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name / title *">
            <input name="name" className="input-field" required defaultValue={editing?.name || ""} />
          </Field>
          <Field label="Slug">
            <input name="slug" className="input-field" placeholder="auto" defaultValue={editing?.slug || ""} />
          </Field>
          <Field label="Short blurb">
            <input name="blurb" className="input-field" defaultValue={editing?.blurb || ""} />
          </Field>
          <Field label="Sort order">
            <input name="sort_order" type="number" className="input-field" defaultValue={editing?.sort_order ?? 0} />
          </Field>
        </div>

        <Field label="Show on home">
          <select
            name="show_on_home"
            className="input-field"
            defaultValue={editing ? String(editing.show_on_home) : "1"}
          >
            <option value="1">Yes — show on home</option>
            <option value="0">No — hide from home</option>
          </select>
        </Field>
        <input type="hidden" name="is_active" value="1" />
        <input type="hidden" name="imageUrl" value={editing?.image || ""} />

        {editing?.image ? (
          <div className="relative aspect-[16/10] max-w-sm overflow-hidden rounded-xl border border-white/10">
            <Image src={editing.image} alt={editing.name} fill className="object-cover" unoptimized={editing.image.startsWith("/uploads/")} />
          </div>
        ) : null}

        <Field label={editing ? "Upload new image (optional)" : "Upload destination image *"}>
          <input name="image" type="file" accept="image/*" className="input-field" required={!editing?.image} />
        </Field>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal disabled:opacity-60">
            {busy ? "Saving…" : editing ? "Update" : "Save destination"}
          </button>
          {editing ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-300">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {initial.map((item) => (
          <article key={item.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light">
            <div className="relative aspect-[16/11]">
              <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized={item.image.startsWith("/uploads/")} />
            </div>
            <div className="space-y-2 p-3">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-xs text-zinc-500">{item.show_on_home ? "On home" : "Hidden from home"}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditing(item)} className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold">
                  Edit
                </button>
                <button type="button" onClick={() => remove(item.slug)} className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-300">
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
