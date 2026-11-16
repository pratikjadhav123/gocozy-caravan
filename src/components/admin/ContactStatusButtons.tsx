"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ContactStatusButtons({
  id,
  status,
}: {
  id: number;
  status: "new" | "replied" | "closed";
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [busy, setBusy] = useState(false);

  async function setStatus(next: typeof status) {
    setBusy(true);
    const res = await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not update enquiry status");
      return;
    }
    setCurrent(next);
    toast.success(`Enquiry marked ${next}`);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(["new", "replied", "closed"] as const).map((s) => (
        <button
          key={s}
          type="button"
          disabled={busy}
          onClick={() => setStatus(s)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
            current === s ? "bg-gold text-charcoal" : "border border-white/15 text-zinc-300"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
