"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type PackageItem = {
  id: number;
  package_key: string;
  option_label: string;
  title: string;
  price: string;
  unit: string;
  description: string | null;
  includes_json: string | null;
  excludes: string | null;
  cta_label: string;
  wa_message: string | null;
  is_active: number;
};

function parseIncludes(raw: string | null) {
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr.join("\n") : raw;
  } catch {
    return raw;
  }
}

export function PackagesEditor({ initial }: { initial: PackageItem[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState("");

  function updateLocal(key: string, patch: Partial<PackageItem>) {
    setRows((prev) => prev.map((r) => (r.package_key === key ? { ...r, ...patch } : r)));
  }

  async function save(row: PackageItem) {
    setBusy(row.package_key);
    const includes = parseIncludes(row.includes_json)
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/packages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        package_key: row.package_key,
        option_label: row.option_label,
        title: row.title,
        price: row.price,
        unit: row.unit,
        description: row.description || "",
        includes,
        excludes: row.excludes || "",
        cta_label: row.cta_label,
        wa_message: row.wa_message || "",
        is_active: Boolean(row.is_active),
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setBusy("");
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Could not save package");
      return;
    }
    toast.success("Package saved", { description: row.title });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <article key={row.package_key} className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs text-gold">{row.package_key}</p>
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={Boolean(row.is_active)}
                onChange={(e) => updateLocal(row.package_key, { is_active: e.target.checked ? 1 : 0 })}
              />
              Active on website
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Option label">
              <input
                className="input-field"
                value={row.option_label}
                onChange={(e) => updateLocal(row.package_key, { option_label: e.target.value })}
              />
            </Field>
            <Field label="Title">
              <input
                className="input-field"
                value={row.title}
                onChange={(e) => updateLocal(row.package_key, { title: e.target.value })}
              />
            </Field>
            <Field label="Price">
              <input
                className="input-field"
                value={row.price}
                onChange={(e) => updateLocal(row.package_key, { price: e.target.value })}
              />
            </Field>
            <Field label="Unit">
              <input
                className="input-field"
                value={row.unit}
                onChange={(e) => updateLocal(row.package_key, { unit: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className="input-field min-h-20 resize-y"
              value={row.description || ""}
              onChange={(e) => updateLocal(row.package_key, { description: e.target.value })}
            />
          </Field>

          <Field label="Includes (one per line)">
            <textarea
              className="input-field min-h-20 resize-y"
              value={parseIncludes(row.includes_json)}
              onChange={(e) =>
                updateLocal(row.package_key, {
                  includes_json: JSON.stringify(
                    e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  ),
                })
              }
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Not included">
              <input
                className="input-field"
                value={row.excludes || ""}
                onChange={(e) => updateLocal(row.package_key, { excludes: e.target.value })}
              />
            </Field>
            <Field label="CTA label">
              <input
                className="input-field"
                value={row.cta_label}
                onChange={(e) => updateLocal(row.package_key, { cta_label: e.target.value })}
              />
            </Field>
          </div>

          <Field label="WhatsApp message">
            <textarea
              className="input-field min-h-24 resize-y"
              value={row.wa_message || ""}
              onChange={(e) => updateLocal(row.package_key, { wa_message: e.target.value })}
            />
          </Field>

          <button
            type="button"
            disabled={busy === row.package_key}
            onClick={() => save(row)}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-charcoal hover:bg-gold-light disabled:opacity-60"
          >
            {busy === row.package_key ? "Saving…" : "Save package text"}
          </button>
        </article>
      ))}
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
