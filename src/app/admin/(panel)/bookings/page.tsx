import Link from "next/link";
import { BookingsFilterBar } from "@/components/admin/BookingsFilterBar";
import { listBookings } from "@/lib/bookings";

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string; from?: string; to?: string }>;
};

function formatInr(value: string | null) {
  if (!value) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "confirmed"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "new"
        ? "bg-gold/15 text-gold"
        : status === "cancelled"
          ? "bg-red-500/15 text-red-300"
          : status === "in_progress"
            ? "bg-sky-500/15 text-sky-300"
            : "bg-white/10 text-zinc-200";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const status = sp.status || "all";
  const q = sp.q || "";
  const from = sp.from || "";
  const to = sp.to || "";

  const bookings = await listBookings({
    status,
    q,
    from: from || undefined,
    to: to || undefined,
    limit: 150,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-400">
          Filter by status, search, or pickup dates — then open a booking to confirm.
        </p>
      </div>

      <BookingsFilterBar
        status={status}
        q={q}
        from={from}
        to={to}
        resultCount={bookings.length}
      />

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Van</th>
              <th className="px-4 py-3">Pickup</th>
              <th className="px-4 py-3">Return</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Confirmation</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-semibold text-gold">{b.reference_no}</td>
                <td className="px-4 py-3">
                  <div className="text-white">{b.customer_name}</div>
                  <div className="text-xs text-zinc-500">+91 {b.phone}</div>
                </td>
                <td className="max-w-[14rem] px-4 py-3 text-zinc-300">{b.vehicle_name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-zinc-300">{b.pickup_date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-zinc-300">{b.return_date}</td>
                <td className="px-4 py-3 text-zinc-300">{b.destination}</td>
                <td className="px-4 py-3 font-medium text-white">{formatInr(b.quoted_amount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                  {b.status === "confirmed" ? (
                    <div className="mt-1 text-[11px] text-zinc-500">
                      {b.confirmation_whatsapp_sent ? "WA ✓ " : ""}
                      {b.confirmation_email_sent ? "Email ✓" : ""}
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold hover:bg-gold/25"
                  >
                    {b.status === "confirmed" ? "View" : "Confirm"}
                  </Link>
                </td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-zinc-500">
                  No bookings match these filters. Try Clear or another status.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
