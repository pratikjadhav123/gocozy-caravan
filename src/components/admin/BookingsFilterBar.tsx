"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

type Props = {
  status: string;
  q: string;
  from: string;
  to: string;
  resultCount: number;
};

function buildHref(next: { status?: string; q?: string; from?: string; to?: string }) {
  const params = new URLSearchParams();
  const status = next.status ?? "all";
  const q = next.q ?? "";
  const from = next.from ?? "";
  const to = next.to ?? "";
  if (status && status !== "all") params.set("status", status);
  if (q.trim()) params.set("q", q.trim());
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return qs ? `/admin/bookings?${qs}` : "/admin/bookings";
}

export function BookingsFilterBar({ status, q, from, to, resultCount }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(q);
  const [pickupFrom, setPickupFrom] = useState(from);
  const [pickupTo, setPickupTo] = useState(to);

  const activeStatus = status || "all";
  const hasFilters = Boolean(
    (activeStatus && activeStatus !== "all") || q || from || to
  );

  function onSearch(e: FormEvent) {
    e.preventDefault();
    router.push(
      buildHref({
        status: activeStatus,
        q: query,
        from: pickupFrom,
        to: pickupTo,
      })
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light/80 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-white">Filters</p>
        <p className="text-xs text-zinc-500">
          {resultCount} booking{resultCount === 1 ? "" : "s"}
          {hasFilters ? " matched" : ""}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((item) => {
          const active = activeStatus === item.value;
          return (
            <Link
              key={item.value}
              href={buildHref({
                status: item.value,
                q: query,
                from: pickupFrom,
                to: pickupTo,
              })}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                active
                  ? "bg-gold text-charcoal"
                  : "border border-white/15 text-zinc-300 hover:border-gold/50 hover:text-gold"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <form onSubmit={onSearch} className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ref, name, phone, van, destination…"
            className="input-field"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Pickup from
          </span>
          <input
            type="date"
            value={pickupFrom}
            onChange={(e) => setPickupFrom(e.target.value)}
            className="input-field min-w-[10.5rem]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Pickup to
          </span>
          <input
            type="date"
            value={pickupTo}
            onChange={(e) => setPickupTo(e.target.value)}
            className="input-field min-w-[10.5rem]"
          />
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-charcoal transition hover:bg-gold-light"
          >
            Apply
          </button>
          {hasFilters ? (
            <Link
              href="/admin/bookings"
              className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-gold hover:text-gold"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
