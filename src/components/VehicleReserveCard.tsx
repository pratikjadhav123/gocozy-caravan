"use client";

import Link from "next/link";
import { SITE, type Vehicle, vehicleCapacityLabel, whatsappUrl } from "@/lib/constants";

export function VehicleReserveCard({ vehicle }: { vehicle: Vehicle }) {
  const wa = whatsappUrl(
    `Hi ${SITE.name}, I want to check availability for ${vehicle.name} (${vehicleCapacityLabel(vehicle)}).`
  );

  return (
    <aside className="rounded-2xl border border-white/10 bg-charcoal-light p-6 shadow-xl lg:sticky lg:top-28">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">Reserve this caravan</p>
      <h2 className="mt-2 font-display text-xl font-bold text-white">{vehicle.name}</h2>
      <p className="mt-1 text-sm text-zinc-400">{vehicleCapacityLabel(vehicle)}</p>
      <p className="mt-4 text-sm text-zinc-300">{vehicle.highlight}</p>

      <Link
        href={`/book?vehicle=${vehicle.id}`}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-gold py-3.5 text-sm font-bold uppercase tracking-wide text-charcoal transition hover:bg-gold-light hover:scale-[1.01]"
      >
        Check availability
      </Link>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center rounded-full border border-[#25D366]/50 py-3 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/10"
      >
        WhatsApp {SITE.phoneDisplay}
      </a>
      <p className="mt-4 text-center text-xs text-zinc-500">
        Fuel & final price confirmed on WhatsApp after dates.
      </p>
    </aside>
  );
}
