"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Vehicle = {
  slug: string;
  name: string;
  seats: string;
  beds: string | null;
  highlight: string;
  image: string;
};

type MediaItem = {
  slot_key: string;
  file_url: string;
  alt_text: string | null;
};

export function HomeFleetCardsEditor({
  vehicles,
  media,
}: {
  vehicles: Vehicle[];
  media: MediaItem[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const mediaMap = Object.fromEntries(media.map((m) => [m.slot_key, m]));

  async function upload(slug: string, file: File | null) {
    if (!file) return;
    const slotKey = `home_fleet_${slug}`;
    setBusy(slotKey);
    const body = new FormData();
    body.set("slotKey", slotKey);
    body.set("section", "home_fleet");
    body.set("file", file);
    body.set("label", `Home Fleet — ${slug}`);
    const res = await fetch("/api/admin/media/upload", { method: "POST", body });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setBusy("");
    if (!res.ok || !data.ok) {
      toast.error(data.error || "Upload failed");
      return;
    }
    toast.success("Home fleet image updated", { description: slug });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        These cards appear on the home page. Upload a card image for each van (file upload only). Van
        name / seats / description come from{" "}
        <Link href="/admin/content?tab=fleet" className="text-gold hover:underline">
          Our Fleet
        </Link>{" "}
        tab.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {vehicles.map((v) => {
          const slot = `home_fleet_${v.slug}`;
          const img = mediaMap[slot]?.file_url || v.image;
          return (
            <article key={v.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light">
              <div className="relative aspect-[4/3]">
                <Image src={img} alt={v.name} fill className="object-cover" unoptimized={img.startsWith("/uploads/")} />
              </div>
              <div className="space-y-2 p-4">
                <p className="font-semibold text-white">{v.name}</p>
                <p className="text-xs text-zinc-500">
                  {v.seats} seats{v.beds ? ` · ${v.beds} beds` : ""}
                </p>
                <p className="line-clamp-2 text-sm text-zinc-400">{v.highlight}</p>
                <input
                  ref={(el) => {
                    refs.current[slot] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => upload(v.slug, e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  disabled={busy === slot}
                  onClick={() => refs.current[slot]?.click()}
                  className="w-full rounded-full bg-gold py-2.5 text-xs font-bold text-charcoal disabled:opacity-60"
                >
                  {busy === slot ? "Uploading…" : "Upload gallery image"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
