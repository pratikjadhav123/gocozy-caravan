"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MEDIA_CATEGORIES } from "@/lib/media-categories";

type MediaItem = {
  id: number;
  title: string;
  category: string;
  alt_text: string | null;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryPanel({
  initial,
  initialCategory = "all",
  initialQuery = "",
}: {
  initial: MediaItem[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState(initial);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [uploadCategory, setUploadCategory] = useState("gallery");
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const catOk = category === "all" || item.category === category;
      if (!catOk) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.alt_text || "").toLowerCase().includes(q) ||
        (item.file_name || "").toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [items, category, query]);

  function addFiles(list: FileList | File[] | null) {
    if (!list) return;
    const next = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!next.length) {
      toast.error("Please drop image files only");
      return;
    }
    setFiles((prev) => [...prev, ...next]);
    toast.success(`${next.length} image${next.length > 1 ? "s" : ""} ready`);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  async function upload(e: FormEvent) {
    e.preventDefault();
    if (!files.length) {
      toast.error("Choose images to upload");
      return;
    }
    setBusy(true);
    const form = new FormData();
    form.set("category", uploadCategory);
    form.set("title", title);
    form.set("alt_text", altText);
    files.forEach((file) => form.append("files", file));

    const res = await fetch("/api/admin/media-library", { method: "POST", body: form });
    const data = (await res.json()) as { ok: boolean; error?: string; count?: number };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Upload failed");
      return;
    }
    toast.success(`Uploaded ${data.count} image${data.count === 1 ? "" : "s"}`);
    setFiles([]);
    setTitle("");
    setAltText("");
    router.refresh();
    // Reload list
    const listRes = await fetch(
      `/api/admin/media-library?category=${encodeURIComponent(category)}&q=${encodeURIComponent(query)}`
    );
    const listData = (await listRes.json()) as { ok: boolean; items?: MediaItem[] };
    if (listData.ok && listData.items) setItems(listData.items);
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    const res = await fetch("/api/admin/media-library", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        title: editing.title,
        category: editing.category,
        alt_text: editing.alt_text || "",
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Update failed");
      return;
    }
    toast.success("Image details updated");
    setItems((prev) => prev.map((item) => (item.id === editing.id ? editing : item)));
    setEditing(null);
    router.refresh();
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this image from Media Library?")) return;
    const res = await fetch(`/api/admin/media-library?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Image deleted");
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editing?.id === id) setEditing(null);
    router.refresh();
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Image URL copied");
    } catch {
      toast.error("Could not copy URL");
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={upload}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Upload images</h3>
            <p className="text-xs text-zinc-500">
              Drag & drop or choose multiple images. Organize by category for website sections.
            </p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal"
          >
            Upload Images
          </button>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`rounded-2xl border border-dashed px-4 py-10 text-center transition ${
            dragging ? "border-gold bg-gold/10" : "border-white/20 bg-charcoal/40"
          }`}
        >
          <p className="text-sm text-zinc-300">Drag & drop images here</p>
          <p className="mt-1 text-xs text-zinc-500">PNG, JPG, WEBP · max 8MB each · multiple allowed</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Category</span>
            <select
              className="input-field"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              {MEDIA_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">
              Title (optional)
            </span>
            <input
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Uses file name if empty"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Alt text</span>
            <input
              className="input-field"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
            />
          </label>
        </div>

        {previews.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {previews.map((p, index) => (
              <div key={p.url} className="relative aspect-square overflow-hidden rounded-xl border border-gold/30">
                <Image src={p.url} alt={p.file.name} fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy || !files.length}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal disabled:opacity-60"
        >
          {busy ? "Uploading…" : `Save ${files.length || ""} image${files.length === 1 ? "" : "s"}`}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-charcoal-light p-4">
        <input
          className="input-field max-w-sm"
          placeholder="Search title, alt, file name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="input-field max-w-[220px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-500">{filtered.length} image(s)</p>
      </div>

      {editing ? (
        <form onSubmit={saveEdit} className="space-y-3 rounded-2xl border border-gold/30 bg-charcoal-light p-5">
          <h4 className="font-semibold text-white">Edit image details</h4>
          <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
              <Image src={editing.file_url} alt={editing.title} fill className="object-cover" unoptimized />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Title</span>
                <input
                  className="input-field"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Category</span>
                <select
                  className="input-field"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {MEDIA_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Alt text</span>
                <input
                  className="input-field"
                  value={editing.alt_text || ""}
                  onChange={(e) => setEditing({ ...editing, alt_text: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal">
              Save details
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-white/20 px-4 py-2 text-xs text-zinc-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light">
            <div className="relative aspect-square">
              <Image
                src={item.file_url}
                alt={item.alt_text || item.title}
                fill
                className="object-cover"
                sizes="25vw"
                unoptimized={item.file_url.startsWith("/uploads/")}
              />
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-semibold text-white">{item.title}</p>
              <p className="text-[11px] uppercase tracking-wide text-gold">{item.category}</p>
              <p className="truncate text-xs text-zinc-500">
                {item.file_name || item.file_url} {formatSize(item.file_size) ? `· ${formatSize(item.file_size)}` : ""}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => copyUrl(item.file_url)}
                  className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-zinc-300"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-full border border-red-400/30 px-2.5 py-1 text-[11px] text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length ? (
        <p className="rounded-xl border border-white/10 px-4 py-10 text-center text-sm text-zinc-500">
          No images found. Upload your first batch above.
        </p>
      ) : null}
    </div>
  );
}
