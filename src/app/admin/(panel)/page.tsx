import Link from "next/link";
import { getDashboardStats } from "@/lib/bookings";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-400">Today’s activity and open booking pipeline.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today (created / pickup)" value={String(stats.todayCount)} />
        <StatCard label="Open pipeline" value={String(stats.totalOpen)} />
        <StatCard label="New" value={String(stats.byStatus.new || 0)} />
        <StatCard label="Confirmed" value={String(stats.byStatus.confirmed || 0)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="rounded-xl border border-white/10 bg-charcoal-light px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-white">{stats.byStatus[key] || 0}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-white">Latest bookings</h3>
          <Link href="/admin/bookings" className="text-sm font-semibold text-gold hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Van</th>
                <th className="px-4 py-3">Pickup</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                    No bookings yet — submit one from the website /book page.
                  </td>
                </tr>
              ) : (
                stats.recent.map((b) => (
                  <tr key={b.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <Link href={`/admin/bookings/${b.id}`} className="font-medium text-gold hover:underline">
                        {b.reference_no}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{b.customer_name}</div>
                      <div className="text-xs text-zinc-500">{b.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{b.vehicle_name}</td>
                    <td className="px-4 py-3 text-zinc-300">{b.pickup_date}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {b.quoted_amount
                        ? new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(Number(b.quoted_amount))
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-charcoal-light p-5">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-gold">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium capitalize text-zinc-200">
      {status.replace("_", " ")}
    </span>
  );
}
