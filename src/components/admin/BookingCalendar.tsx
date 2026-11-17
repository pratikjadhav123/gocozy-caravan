"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FLEET_UNITS } from "@/lib/constants";

export type CalendarBooking = {
  id: number;
  reference_no: string;
  status: string;
  customer_name: string;
  vehicle_id: string;
  vehicle_name: string;
  pickup_date: string;
  return_date: string;
  destination: string;
};

type Props = {
  initialYear: number;
  initialMonth: number;
  bookings: CalendarBooking[];
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toYmd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseYmd(value: string) {
  const raw = String(value).slice(0, 10);
  const [y, m, d] = raw.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function shortDate(value: string) {
  return parseYmd(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function dayCountSpan(pickup: string, ret: string) {
  const ms = parseYmd(ret).getTime() - parseYmd(pickup).getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}

function normalizeVehicleId(vehicleId: string) {
  return vehicleId === "cozy-urbaniya" ? "cozy-urbania" : vehicleId;
}

function unitFor(vehicleId: string) {
  return FLEET_UNITS.find((u) => u.vehicleId === normalizeVehicleId(vehicleId)) ?? null;
}

function firstName(full: string) {
  return full.trim().split(/\s+/)[0] || full;
}

export function BookingCalendar({ initialYear, initialMonth, bookings }: Props) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ year: initialYear, month: initialMonth });
  const [activeFleet, setActiveFleet] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [focusDay, setFocusDay] = useState<number | null>(null);

  useEffect(() => {
    setCursor({ year: initialYear, month: initialMonth });
  }, [initialYear, initialMonth]);

  const dayCount = daysInMonth(cursor.year, cursor.month);
  const monthStart = `${cursor.year}-${pad2(cursor.month)}-01`;
  const monthEnd = `${cursor.year}-${pad2(cursor.month)}-${pad2(dayCount)}`;
  const today = toYmd(new Date());
  const todayDay = today.startsWith(`${cursor.year}-${pad2(cursor.month)}-`)
    ? Number(today.slice(-2))
    : null;

  // Scroll toward today once per month view
  useEffect(() => {
    if (!todayDay || !scrollerRef.current) return;
    const el = scrollerRef.current;
    const ratio = (todayDay - 1) / Math.max(dayCount, 1);
    el.scrollLeft = Math.max(0, el.scrollWidth * ratio - el.clientWidth * 0.35);
  }, [cursor.year, cursor.month, todayDay, dayCount]);

  const allMonthBookings = useMemo(() => {
    const start = parseYmd(monthStart).getTime();
    const end = parseYmd(monthEnd).getTime();
    return bookings.filter((b) => {
      const p = parseYmd(b.pickup_date).getTime();
      const r = parseYmd(b.return_date).getTime();
      return p <= end && r >= start;
    });
  }, [bookings, monthStart, monthEnd]);

  const monthBookings = useMemo(() => {
    if (activeFleet === "all") return allMonthBookings;
    return allMonthBookings.filter((b) => normalizeVehicleId(b.vehicle_id) === activeFleet);
  }, [allMonthBookings, activeFleet]);

  const selected =
    monthBookings.find((b) => b.id === selectedId) ||
    bookings.find((b) => b.id === selectedId) ||
    null;

  const stats = useMemo(() => {
    const byFleet = FLEET_UNITS.map((unit) => ({
      ...unit,
      count: allMonthBookings.filter((b) => normalizeVehicleId(b.vehicle_id) === unit.vehicleId)
        .length,
    }));
    const bookedTodayIds = new Set<string>();
    if (todayDay) {
      const t = parseYmd(today).getTime();
      for (const b of allMonthBookings) {
        const p = parseYmd(b.pickup_date).getTime();
        const r = parseYmd(b.return_date).getTime();
        if (p <= t && r >= t) bookedTodayIds.add(normalizeVehicleId(b.vehicle_id));
      }
    }
    return {
      total: allMonthBookings.length,
      byFleet,
      freeToday: Math.max(0, FLEET_UNITS.length - bookedTodayIds.size),
      busyToday: bookedTodayIds.size,
    };
  }, [allMonthBookings, today, todayDay]);

  function goMonth(year: number, month: number) {
    setCursor({ year, month });
    setSelectedId(null);
    setFocusDay(null);
    router.replace(`/admin/bookings/calendar?year=${year}&month=${month}`);
  }

  function shiftMonth(delta: number) {
    const d = new Date(cursor.year, cursor.month - 1 + delta, 1);
    goMonth(d.getFullYear(), d.getMonth() + 1);
  }

  function spanFor(booking: CalendarBooking) {
    const pickup = parseYmd(booking.pickup_date);
    const ret = parseYmd(booking.return_date);
    const first = new Date(cursor.year, cursor.month - 1, 1);
    const last = new Date(cursor.year, cursor.month - 1, dayCount);
    const start = pickup < first ? first : pickup;
    const end = ret > last ? last : ret;
    return {
      colStart: start.getDate(),
      colSpan: Math.max(1, end.getDate() - start.getDate() + 1),
    };
  }

  function bookingsOnDay(day: number) {
    const t = parseYmd(`${cursor.year}-${pad2(cursor.month)}-${pad2(day)}`).getTime();
    return monthBookings.filter((b) => {
      const p = parseYmd(b.pickup_date).getTime();
      const r = parseYmd(b.return_date).getTime();
      return p <= t && r >= t;
    });
  }

  const visibleUnits =
    activeFleet === "all"
      ? [...FLEET_UNITS]
      : FLEET_UNITS.filter((u) => u.vehicleId === activeFleet);

  const dayCol = `minmax(34px, 1fr)`;
  const gridCols = `7.25rem repeat(${dayCount}, ${dayCol})`;

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-charcoal-light/50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="btn-press inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-lg text-zinc-200 transition hover:border-gold/40 hover:text-gold"
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="px-2 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                Fleet calendar
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
                {monthLabel(cursor.year, cursor.month)}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="btn-press inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-lg text-zinc-200 transition hover:border-gold/40 hover:text-gold"
              aria-label="Next month"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                goMonth(now.getFullYear(), now.getMonth() + 1);
                setFocusDay(now.getDate());
              }}
              className="btn-press ml-1 rounded-2xl border border-gold/40 bg-gold/15 px-3.5 py-2 text-xs font-bold text-gold transition hover:bg-gold hover:text-charcoal"
            >
              Today
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-black/25 p-1.5">
            <button
              type="button"
              onClick={() => setActiveFleet("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeFleet === "all"
                  ? "bg-white text-charcoal shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All vans
            </button>
            {FLEET_UNITS.map((unit) => (
              <button
                key={unit.code}
                type="button"
                onClick={() =>
                  setActiveFleet((prev) => (prev === unit.vehicleId ? "all" : unit.vehicleId))
                }
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeFleet === unit.vehicleId
                    ? unit.color
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {unit.code}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <StatCard label="This month" value={String(stats.total)} hint="confirmed trips" />
          <StatCard
            label="Free today"
            value={`${stats.freeToday}/3`}
            hint="vans available"
            tone="green"
          />
          <StatCard label="Busy today" value={`${stats.busyToday}/3`} hint="vans on trip" />
          <div className="rounded-2xl border border-white/10 bg-black/25 px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              By van
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {stats.byFleet.map((unit) => (
                <span
                  key={unit.code}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${unit.color}`}
                >
                  {unit.code}
                  <span className="opacity-80">{unit.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1118]">
        <div ref={scrollerRef} className="admin-sidebar-scroll overflow-x-auto">
          <div className="min-w-[860px] p-3">
            {/* Days */}
            <div className="grid" style={{ gridTemplateColumns: gridCols }}>
              <div className="sticky left-0 z-30 bg-[#0a1118] px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Van
              </div>
              {Array.from({ length: dayCount }, (_, i) => {
                const day = i + 1;
                const isToday = todayDay === day;
                const isFocus = focusDay === day;
                const weekday = new Date(cursor.year, cursor.month - 1, day).getDay();
                const hasTrip = bookingsOnDay(day).length > 0;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      setFocusDay((prev) => (prev === day ? null : day));
                      setSelectedId(null);
                    }}
                    className={`relative rounded-xl py-2 text-center transition ${
                      isToday
                        ? "bg-gold text-charcoal shadow-[0_0_28px_rgba(232,185,35,0.4)]"
                        : isFocus
                          ? "bg-white/12 text-white"
                          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    <span className="block text-[9px] font-medium uppercase opacity-70">
                      {["S", "M", "T", "W", "T", "F", "S"][weekday]}
                    </span>
                    <span className="block text-sm font-bold leading-none">{day}</span>
                    {hasTrip && !isToday ? (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 space-y-2">
              {visibleUnits.map((unit) => {
                const laneBookings = monthBookings.filter(
                  (b) => normalizeVehicleId(b.vehicle_id) === unit.vehicleId
                );
                const busyToday =
                  todayDay != null &&
                  laneBookings.some((b) => {
                    const p = parseYmd(b.pickup_date).getTime();
                    const r = parseYmd(b.return_date).getTime();
                    const t = parseYmd(today).getTime();
                    return p <= t && r >= t;
                  });

                return (
                  <div
                    key={unit.code}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]"
                  >
                    <div className="grid" style={{ gridTemplateColumns: gridCols }}>
                      <div className="sticky left-0 z-20 flex items-center gap-2.5 border-r border-white/10 bg-[#101821] px-2.5 py-3.5">
                        <span
                          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${unit.color}`}
                        >
                          {unit.code}
                        </span>
                        <div className="min-w-0 leading-tight">
                          <p className="text-xs font-semibold text-white">{unit.code}</p>
                          <p
                            className={`text-[10px] ${
                              busyToday ? "text-amber-300/90" : "text-emerald-400/80"
                            }`}
                          >
                            {busyToday ? "On trip" : "Free"}
                          </p>
                        </div>
                      </div>

                      {Array.from({ length: dayCount }, (_, i) => {
                        const day = i + 1;
                        return (
                          <div
                            key={day}
                            className={`min-h-[64px] border-l border-white/[0.035] ${
                              todayDay === day
                                ? "bg-gold/10"
                                : focusDay === day
                                  ? "bg-white/[0.05]"
                                  : ""
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div
                      className="pointer-events-none absolute inset-y-0 left-[7.25rem] right-0 grid items-center"
                      style={{ gridTemplateColumns: `repeat(${dayCount}, ${dayCol})` }}
                    >
                      {laneBookings.map((booking) => {
                        const span = spanFor(booking);
                        const active = selectedId === booking.id;
                        const days = dayCountSpan(booking.pickup_date, booking.return_date);
                        const label =
                          span.colSpan >= 3
                            ? `${firstName(booking.customer_name)} · ${days}d`
                            : firstName(booking.customer_name);
                        return (
                          <button
                            key={booking.id}
                            type="button"
                            onClick={() => {
                              setSelectedId(booking.id);
                              setFocusDay(null);
                            }}
                            className={`pointer-events-auto z-[1] mx-0.5 truncate rounded-full border px-2.5 py-1.5 text-left text-[11px] font-bold shadow-[0_6px_18px_rgba(0,0,0,0.28)] transition hover:brightness-110 ${
                              unit.bar
                            } ${active ? "ring-2 ring-white scale-[1.03]" : ""}`}
                            style={{
                              gridColumn: `${span.colStart} / span ${span.colSpan}`,
                            }}
                            title={`${booking.customer_name} · ${booking.reference_no} · ${booking.pickup_date} → ${booking.return_date}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="rounded-3xl border border-gold/30 bg-gradient-to-r from-gold/10 to-charcoal-light p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    unitFor(selected.vehicle_id)?.color || "bg-gold text-charcoal"
                  }`}
                >
                  {unitFor(selected.vehicle_id)?.code || "Van"}
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold capitalize text-emerald-300">
                  {selected.status.replace("_", " ")}
                </span>
                <span className="text-xs text-zinc-500">{selected.reference_no}</span>
              </div>
              <p className="mt-2 font-display text-xl font-semibold text-white">
                {selected.customer_name}
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                {shortDate(selected.pickup_date)} → {shortDate(selected.return_date)}
                <span className="text-zinc-500">
                  {" "}
                  · {dayCountSpan(selected.pickup_date, selected.return_date)} days
                </span>
                {selected.destination ? (
                  <span className="text-zinc-500"> · {selected.destination}</span>
                ) : null}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-300"
              >
                Close
              </button>
              <Link
                href={`/admin/bookings/${selected.id}`}
                className="btn-press rounded-full bg-gold px-5 py-2 text-xs font-bold text-charcoal hover:bg-gold-light"
              >
                Open booking →
              </Link>
            </div>
          </div>
        </div>
      ) : focusDay ? (
        <div className="rounded-3xl border border-white/10 bg-charcoal-light/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {focusDay} {monthLabel(cursor.year, cursor.month)}
          </p>
          {bookingsOnDay(focusDay).length ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {bookingsOnDay(focusDay).map((b) => {
                const unit = unitFor(b.vehicle_id);
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(b.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-3.5 py-3 text-left transition hover:border-gold/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{b.customer_name}</p>
                        <p className="text-xs text-zinc-500">
                          {shortDate(b.pickup_date)} → {shortDate(b.return_date)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          unit?.color || "bg-gold text-charcoal"
                        }`}
                      >
                        {unit?.code}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">All vans free on this day.</p>
          )}
        </div>
      ) : (
        <p className="text-center text-xs text-zinc-500">
          Tap a trip pill or a day to see details.
        </p>
      )}

      {!allMonthBookings.length ? (
        <div className="rounded-3xl border border-dashed border-white/15 px-4 py-10 text-center">
          <p className="font-display text-lg text-white">No confirmed trips this month</p>
          <p className="mt-1 text-sm text-zinc-500">
            Confirm a booking and it appears on T1 / T2 / T3.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "green";
}) {
  return (
    <div
      className={`rounded-2xl border px-3.5 py-3 ${
        tone === "green"
          ? "border-emerald-400/25 bg-emerald-500/10"
          : "border-white/10 bg-black/25"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          tone === "green" ? "text-emerald-400/80" : "text-zinc-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-semibold ${
          tone === "green" ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] text-zinc-500">{hint}</p>
    </div>
  );
}
