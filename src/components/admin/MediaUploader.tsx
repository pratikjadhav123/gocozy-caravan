"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type MediaItem = {
  id: number;
  slot_key: string;
  label: string;
  section: string;
  file_url: string;
  alt_text: string | null;
};

export function MediaUploader({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [busyKey, setBusyKey] = useState("");
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function onUpload(slotKey: string, section: string, file: File | null) {
    if (!file) return;
    setBusyKey(slotKey);

    const body = new FormData();
    body.set("slotKey", slotKey);
    body.set("section", section);
    body.set("file", file);

    const res = await fetch("/api/admin/media/upload", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setBusyKey("");
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Image upload failed");
      return;
    }
    toast.success("Image updated", { description: slotKey });
    router.refresh();
  }

  const grouped = items.reduce<Record<string, MediaItem[]>>((acc, item) => {
    (acc[item.section] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([section, rows]) => (
        <section key={section} className="space-y-4">
          <h3 className="font-display text-lg font-semibold capitalize text-white">
            {section.replaceAll("_", " ")}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((item) => (
              <article
                key={item.slot_key}
                className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
              >
                <div className="relative aspect-[16/10] bg-black/30">
                  <Image
                    src={item.file_url}
                    alt={item.alt_text || item.label}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                    unoptimized={item.file_url.startsWith("/uploads/")}
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-500">{item.slot_key}</p>
                  </div>
                  <input
                    ref={(el) => {
                      inputRefs.current[item.slot_key] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      onUpload(item.slot_key, item.section, e.target.files?.[0] || null)
                    }
                  />
                  <button
                    type="button"
                    disabled={busyKey === item.slot_key}
                    onClick={() => inputRefs.current[item.slot_key]?.click()}
                    className="w-full rounded-full bg-gold py-2.5 text-xs font-bold text-charcoal transition hover:bg-gold-light disabled:opacity-60"
                  >
                    {busyKey === item.slot_key ? "Uploading…" : "Upload new image"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
