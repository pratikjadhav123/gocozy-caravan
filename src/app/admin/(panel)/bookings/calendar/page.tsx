import Link from "next/link";
import { BookingCalendar } from "@/components/admin/BookingCalendar";
import { listBookingsOverlapping } from "@/lib/bookings";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

export default async function AdminBookingCalendarPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const now = new Date();
  const year = Math.min(2100, Math.max(2020, Number(sp.year) || now.getFullYear()));
  const month = Math.min(12, Math.max(1, Number(sp.month) || now.getMonth() + 1));

  const rangeStart = new Date(year, month - 4, 1);
  const rangeEnd = new Date(year, month + 4, 0);
  const padFrom = `${rangeStart.getFullYear()}-${String(rangeStart.getMonth() + 1).padStart(2, "0")}-01`;
  const padTo = `${rangeEnd.getFullYear()}-${String(rangeEnd.getMonth() + 1).padStart(2, "0")}-${String(rangeEnd.getDate()).padStart(2, "0")}`;

  let bookings: Awaited<ReturnType<typeof listBookingsOverlapping>> = [];
  let error = "";
  try {
    bookings = await listBookingsOverlapping({
      from: padFrom,
      to: padTo,
      statuses: ["confirmed", "in_progress"],
    });
  } catch {
    error = "Could not load bookings. Check MySQL is running and bookings table exists.";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-zinc-400">
          Simple fleet view — confirmed trips on <span className="text-gold">T1</span>,{" "}
          <span className="text-sky-300">T2</span>, <span className="text-emerald-300">T3</span>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/bookings"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-gold/40 hover:text-gold"
          >
            List
          </Link>
          <Link
            href="/admin/bookings/new"
            className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal transition hover:bg-gold-light"
          >
            + New booking
          </Link>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <BookingCalendar
          initialYear={year}
          initialMonth={month}
          bookings={bookings.map((b) => ({
            id: b.id,
            reference_no: b.reference_no,
            status: b.status,
            customer_name: b.customer_name,
            vehicle_id: b.vehicle_id,
            vehicle_name: b.vehicle_name,
            pickup_date: String(b.pickup_date).slice(0, 10),
            return_date: String(b.return_date).slice(0, 10),
            destination: b.destination,
          }))}
        />
      )}
    </div>
  );
}
