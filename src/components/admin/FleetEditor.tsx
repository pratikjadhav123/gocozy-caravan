"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type VehicleItem = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  seats: string;
  beds: string | null;
  highlight: string;
  image: string;
  about: string | null;
  gallery_json: string | null;
  features_json: string | null;
  included_json: string | null;
  excluded_json: string | null;
  is_active: number;
};

type GalleryItem = { src: string; alt?: string };

function featuresToText(raw: string | null) {
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw) as { title: string; description: string }[];
    if (!Array.isArray(arr)) return "";
    return arr.map((f) => `${f.title}: ${f.description}`).join("\n");
  } catch {
    return "";
  }
}

function listToText(raw: string | null) {
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw) as string[];
    if (!Array.isArray(arr)) return "";
    return arr.map(String).join("\n");
  } catch {
    return "";
  }
}

function parseGallery(raw: string | null, fallbackSrc?: string): GalleryItem[] {
  if (raw) {
    try {
      const arr = JSON.parse(raw) as GalleryItem[];
      if (Array.isArray(arr) && arr.length) return arr.filter((g) => g?.src);
    } catch {
      // ignore
    }
  }
  return fallbackSrc ? [{ src: fallbackSrc }] : [];
}

export function FleetEditor({ initial }: { initial: VehicleItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<VehicleItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const newGalleryPreviews = useMemo(
    () => newGalleryFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newGalleryFiles]
  );

  useEffect(() => {
    return () => {
      newGalleryPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [newGalleryPreviews]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  function startEdit(v: VehicleItem) {
    setEditing(v);
    setGalleryItems(parseGallery(v.gallery_json, v.image));
    setNewGalleryFiles([]);
    setCoverFile(null);
  }

  function clearForm() {
    setEditing(null);
    setGalleryItems([]);
    setNewGalleryFiles([]);
    setCoverFile(null);
  }

  function removeGalleryItem(src: string) {
    setGalleryItems((prev) => prev.filter((g) => g.src !== src));
  }

  function onPickGallery(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!next.length) {
      toast.error("Please choose image files");
      return;
    }
    setNewGalleryFiles((prev) => [...prev, ...next]);
    toast.success(`${next.length} image${next.length > 1 ? "s" : ""} ready to upload`);
  }

  function removeNewFile(index: number) {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);

    // Keep existing gallery images (after removals)
    form.set("galleryExisting", JSON.stringify(galleryItems.map((g) => g.src)));

    // New gallery uploads
    newGalleryFiles.forEach((file) => form.append("galleryFiles", file));

    // Cover image
    if (coverFile) form.set("image", coverFile);
    form.set("imageUrl", editing?.image || galleryItems[0]?.src || "");

    const res = await fetch("/api/admin/fleet", { method: "POST", body: form });
    const data = (await res.json()) as { ok: boolean; error?: string; slug?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save fleet van");
      return;
    }
    toast.success("Fleet van saved", { description: data.slug });
    clearForm();
    e.currentTarget.reset();
    router.refresh();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete fleet item ${slug}?`)) return;
    const res = await fetch(`/api/admin/fleet?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Could not delete fleet van");
      return;
    }
    toast.success("Fleet van deleted", { description: slug });
    if (editing?.slug === slug) clearForm();
    router.refresh();
  }

  const displayCover = coverPreview || editing?.image || "";

  return (
    <div className="space-y-6">
      <form
        key={editing ? `edit-${editing.slug}` : "new-fleet"}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <h3 className="font-display text-lg font-semibold text-white">
          {editing ? `Edit: ${editing.name}` : "Add / update fleet van"}
        </h3>
        <p className="text-xs text-zinc-500">
          Upload cover + more gallery images. They show on Our Fleet detail page.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Van name / title *">
            <input name="name" className="input-field" required defaultValue={editing?.name || ""} />
          </Field>
          <Field label="Slug (url id)">
            <input
              name="slug"
              className="input-field"
              placeholder="auto from name"
              defaultValue={editing?.slug || ""}
            />
          </Field>
          <Field label="Tagline / header">
            <input name="tagline" className="input-field" defaultValue={editing?.tagline || ""} />
          </Field>
          <Field label="Highlight">
            <input name="highlight" className="input-field" defaultValue={editing?.highlight || ""} />
          </Field>
          <Field label="Seats">
            <input name="seats" className="input-field" defaultValue={editing?.seats || ""} />
          </Field>
          <Field label="Beds">
            <input name="beds" className="input-field" defaultValue={editing?.beds || ""} />
          </Field>
        </div>

        <Field label="Description / about">
          <textarea
            name="about"
            className="input-field min-h-28 resize-y"
            defaultValue={editing?.about || ""}
          />
        </Field>

        <Field label="Features (one per line: Title: description)">
          <textarea
            name="features"
            className="input-field min-h-24 resize-y"
            placeholder={"LED lounge: Ambient lighting\nSmart TV: Entertainment onboard"}
            defaultValue={featuresToText(editing?.features_json || null)}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Included in quote (one per line)">
            <textarea
              name="included"
              className="input-field min-h-28 resize-y"
              placeholder="Professional chauffeur (on request)"
              defaultValue={listToText(editing?.included_json || null)}
            />
          </Field>
          <Field label="Not included (one per line)">
            <textarea
              name="excluded"
              className="input-field min-h-28 resize-y"
              placeholder="Toll taxes & state entry permits"
              defaultValue={listToText(editing?.excluded_json || null)}
            />
          </Field>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-charcoal/40 p-4">
          <p className="text-sm font-semibold text-white">Cover image</p>
          {displayCover ? (
            <div className="relative aspect-[16/10] max-w-md overflow-hidden rounded-xl border border-white/10">
              <Image
                src={displayCover}
                alt="Cover preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">
              Upload cover image {editing ? "(optional)" : "*"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="input-field"
              required={!editing?.image && !coverFile}
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-charcoal/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">Gallery images</p>
              <p className="text-xs text-zinc-500">
                Add more photos for the fleet detail page. Click upload to add one or many.
              </p>
            </div>
            <label className="cursor-pointer rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal hover:bg-gold-light">
              Upload more images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  onPickGallery(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {galleryItems.length || newGalleryPreviews.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {galleryItems.map((item) => (
                <div
                  key={item.src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                >
                  <Image
                    src={item.src}
                    alt={item.alt || "Gallery"}
                    fill
                    className="object-cover"
                    unoptimized={item.src.startsWith("/uploads/") || item.src.startsWith("blob:")}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(item.src)}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-red-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {newGalleryPreviews.map((item, index) => (
                <div
                  key={item.url}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gold/40"
                >
                  <Image src={item.url} alt={item.file.name} fill className="object-cover" unoptimized />
                  <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-charcoal">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-zinc-500">
              No gallery images yet. Click “Upload more images” to add.
            </p>
          )}
        </div>

        <input type="hidden" name="is_active" value="1" />
        <input type="hidden" name="sort_order" value="0" />

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal disabled:opacity-60"
          >
            {busy ? "Saving…" : editing ? "Update van" : "Save van"}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={clearForm}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-300"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {initial.map((v) => {
          const count = parseGallery(v.gallery_json, v.image).length;
          return (
            <article
              key={v.slug}
              className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={v.image}
                  alt={v.name}
                  fill
                  className="object-cover"
                  sizes="33vw"
                  unoptimized={v.image.startsWith("/uploads/")}
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="font-semibold text-white">{v.name}</p>
                <p className="text-xs text-zinc-500">
                  {v.slug} · {count} gallery photo{count === 1 ? "" : "s"}
                </p>
                <p className="line-clamp-2 text-sm text-zinc-400">{v.highlight}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => startEdit(v)}
                    className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold"
                  >
                    Edit + add images
                  </button>
                  <Link
                    href={`/vehicles/${v.slug}`}
                    target="_blank"
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-300"
                  >
                    View detail
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(v.slug)}
                    className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
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
