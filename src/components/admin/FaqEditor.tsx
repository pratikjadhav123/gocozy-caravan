"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Item = {
  id: number;
  slug: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: number;
};

export function FaqEditor({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: String(form.get("slug") || ""),
        question: String(form.get("question") || ""),
        answer: String(form.get("answer") || ""),
        sort_order: Number(form.get("sort_order") || 0),
        is_active: true,
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string; slug?: string };
    setBusy(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save FAQ");
      return;
    }
    toast.success("FAQ saved", { description: data.slug });
    setEditing(null);
    e.currentTarget.reset();
    router.refresh();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete FAQ ${slug}?`)) return;
    const res = await fetch(`/api/admin/faqs?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Could not delete FAQ");
      return;
    }
    toast.success("FAQ deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        key={editing ? `edit-${editing.slug}` : "new-faq"}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5"
      >
        <h3 className="font-display text-lg font-semibold text-white">
          {editing ? `Edit FAQ` : "Add / update FAQ"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">
              Question *
            </span>
            <input
              name="question"
              className="input-field"
              required
              defaultValue={editing?.question || ""}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">Slug</span>
            <input
              name="slug"
              className="input-field"
              placeholder="auto"
              defaultValue={editing?.slug || ""}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">
              Sort order
            </span>
            <input
              name="sort_order"
              type="number"
              className="input-field"
              defaultValue={editing?.sort_order ?? 0}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-zinc-500">
              Answer *
            </span>
            <textarea
              name="answer"
              className="input-field min-h-28 resize-y"
              required
              defaultValue={editing?.answer || ""}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-charcoal hover:bg-gold-light disabled:opacity-60"
          >
            {busy ? "Saving…" : editing ? "Update FAQ" : "Save FAQ"}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-zinc-300"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {initial.map((item) => (
          <article
            key={item.slug}
            className="rounded-2xl border border-white/10 bg-charcoal-light p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-white">{item.question}</p>
                <p className="mt-1 font-mono text-[11px] text-zinc-500">{item.slug}</p>
                <p className="mt-2 text-sm text-zinc-400">{item.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-gold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {initial.length === 0 ? (
          <p className="rounded-xl border border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
            No FAQs yet — add your first question above.
          </p>
        ) : null}
      </div>
    </div>
  );
}
