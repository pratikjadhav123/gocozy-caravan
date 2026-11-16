"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type TextItem = {
  text_key: string;
  label: string;
  content: string;
};

export function TextsEditor({ initial }: { initial: TextItem[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState("");

  async function save(row: TextItem) {
    setBusy(row.text_key);
    const res = await fetch("/api/admin/texts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_key: row.text_key, content: row.content }),
    });
    setBusy("");
    if (!res.ok) {
      toast.error("Could not save text", { description: row.label });
      return;
    }
    toast.success("Text saved", { description: row.label });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <article key={row.text_key} className="rounded-2xl border border-white/10 bg-charcoal-light p-4">
          <p className="text-sm font-semibold text-white">{row.label}</p>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">{row.text_key}</p>
          <textarea
            className="input-field mt-3 min-h-20 resize-y"
            value={row.content}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((r) => (r.text_key === row.text_key ? { ...r, content: e.target.value } : r))
              )
            }
          />
          <button
            type="button"
            disabled={busy === row.text_key}
            onClick={() => save(row)}
            className="mt-3 rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal hover:bg-gold-light disabled:opacity-60"
          >
            {busy === row.text_key ? "Saving…" : "Save text"}
          </button>
        </article>
      ))}
    </div>
  );
}
