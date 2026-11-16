"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type BlogItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  content_json: string | null;
  image: string;
  author: string;
  post_date: string;
  date_label: string;
  read_mins: number;
  is_active: number;
};

function contentToText(raw: string | null) {
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr.join("\n\n") : raw;
  } catch {
    return raw;
  }
}

function toDateInput(value: string | null | undefined) {
  if (!value) return "";
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function BlogEditor({ initial }: { initial: BlogItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<BlogItem | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/blog", { method: "POST", body: form });
    const data = (await res.json()) as { ok: boolean; error?: string; slug?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save blog post");
      return;
    }
    toast.success("Blog post saved", { description: data.slug });
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete blog ${slug}?`)) return;
    const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Could not delete blog post");
      return;
    }
    toast.success("Blog post deleted", { description: slug });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        key={editing ? `edit-${editing.slug}` : "new-blog"}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <h3 className="font-display text-lg font-semibold text-white">
          {editing ? `Edit: ${editing.title}` : "Add / update blog post"}
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title / header *">
            <input name="title" className="input-field" required defaultValue={editing?.title || ""} />
          </Field>
          <Field label="Slug">
            <input name="slug" className="input-field" placeholder="auto from title" defaultValue={editing?.slug || ""} />
          </Field>
          <Field label="Category / tag">
            <input name="category" className="input-field" defaultValue={editing?.category || "Travel guides"} />
          </Field>
          <Field label="Author">
            <input name="author" className="input-field" defaultValue={editing?.author || "Go Cozy Team"} />
          </Field>
          <Field label="Date">
            <input
              name="post_date"
              type="date"
              className="input-field"
              defaultValue={toDateInput(editing?.post_date)}
            />
          </Field>
          <Field label="Read minutes">
            <input name="read_mins" type="number" min={1} className="input-field" defaultValue={editing?.read_mins || 5} />
          </Field>
        </div>

        <Field label="Short description / excerpt">
          <textarea name="excerpt" className="input-field min-h-20 resize-y" defaultValue={editing?.excerpt || ""} />
        </Field>

        <Field label="Full content (blank line = new paragraph)">
          <textarea
            name="content"
            className="input-field min-h-40 resize-y"
            defaultValue={contentToText(editing?.content_json || null)}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Image URL">
            <input name="imageUrl" className="input-field" defaultValue={editing?.image || ""} />
          </Field>
          <Field label="Upload image">
            <input name="image" type="file" accept="image/*" className="input-field" />
          </Field>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal disabled:opacity-60">
            {busy ? "Saving…" : editing ? "Update post" : "Save post"}
          </button>
          {editing ? (
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-300">
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {initial.map((post) => (
          <article key={post.slug} className="grid gap-4 rounded-2xl border border-white/10 bg-charcoal-light p-4 sm:grid-cols-[160px_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image src={post.image} alt={post.title} fill className="object-cover" sizes="160px" unoptimized={post.image.startsWith("/uploads/")} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</p>
              <h4 className="mt-1 font-semibold text-white">{post.title}</h4>
              <p className="mt-1 text-sm text-zinc-400">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditing(post)} className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold">
                  Edit fields
                </button>
                <Link href={`/blog/${post.slug}`} target="_blank" className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-300">
                  View post
                </Link>
                <button type="button" onClick={() => remove(post.slug)} className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-300">
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
