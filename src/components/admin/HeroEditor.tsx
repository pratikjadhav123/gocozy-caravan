"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Slide = {
  id: number;
  slug: string;
  eyebrow: string;
  title: string;
  highlight: string;
  caption: string | null;
  image: string;
  alt_text: string | null;
  sort_order: number;
  is_active: number;
};

export function HeroEditor({ initial }: { initial: Slide[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/hero", { method: "POST", body: form });
    const data = (await res.json()) as { ok: boolean; error?: string; slug?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save hero slide");
      return;
    }
    toast.success("Hero slide saved", { description: data.slug });
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete hero slide ${slug}?`)) return;
    const res = await fetch(`/api/admin/hero?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete slide");
      return;
    }
    toast.success("Hero slide deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        key={editing ? `edit-${editing.slug}` : "new-hero"}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <h3 className="font-display text-lg font-semibold text-white">
          {editing ? `Edit slide: ${editing.title}` : "Add / update hero slide"}
        </h3>
        <p className="text-xs text-zinc-500">Upload the background image (no URL paste). Text updates live on the home hero.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Eyebrow / top line">
            <input name="eyebrow" className="input-field" defaultValue={editing?.eyebrow || "Luxury caravan travel across India"} />
          </Field>
          <Field label="Slug">
            <input name="slug" className="input-field" placeholder="auto" defaultValue={editing?.slug || ""} />
          </Field>
          <Field label="Title *">
            <input name="title" className="input-field" required defaultValue={editing?.title || ""} />
          </Field>
          <Field label="Highlight (gold line)">
            <input name="highlight" className="input-field" defaultValue={editing?.highlight || ""} />
          </Field>
          <Field label="Sort order">
            <input name="sort_order" type="number" className="input-field" defaultValue={editing?.sort_order ?? 0} />
          </Field>
          <Field label="Image alt text">
            <input name="alt_text" className="input-field" defaultValue={editing?.alt_text || ""} />
          </Field>
        </div>

        <Field label="Caption / description">
          <textarea name="caption" className="input-field min-h-20 resize-y" defaultValue={editing?.caption || ""} />
        </Field>

        {editing?.image ? (
          <div className="relative aspect-[21/9] max-w-xl overflow-hidden rounded-xl border border-white/10">
            <Image src={editing.image} alt={editing.alt_text || editing.title} fill className="object-cover" unoptimized={editing.image.startsWith("/uploads/")} />
          </div>
        ) : null}

        <input type="hidden" name="imageUrl" value={editing?.image || ""} />
        <Field label={editing ? "Upload new image (optional)" : "Upload hero image *"}>
          <input name="image" type="file" accept="image/*" className="input-field" required={!editing?.image} />
        </Field>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal disabled:opacity-60">
            {busy ? "Saving…" : editing ? "Update slide" : "Save slide"}
          </button>
          {editing ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-300">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {initial.map((slide) => (
          <article key={slide.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light">
            <div className="relative aspect-[16/9]">
              <Image src={slide.image} alt={slide.alt_text || slide.title} fill className="object-cover" unoptimized={slide.image.startsWith("/uploads/")} />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-xs uppercase tracking-wide text-gold">{slide.eyebrow}</p>
              <p className="font-semibold text-white">{slide.title}</p>
              <p className="text-sm text-gold">{slide.highlight}</p>
              <p className="line-clamp-2 text-sm text-zinc-400">{slide.caption}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => setEditing(slide)} className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold">
                  Edit
                </button>
                <button type="button" onClick={() => remove(slide.slug)} className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-300">
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
