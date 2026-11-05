import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingStatusForm } from "@/components/admin/BookingStatusForm";
import { getBookingById } from "@/lib/bookings";

type PageProps = { params: Promise<{ id: string }> };

function formatInr(value: string | null) {
  if (!value) return "Not set";
  const n = Number(value);
  if (!Number.isFinite(n)) return "Not set";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const booking = await getBookingById(Number(id));
  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/bookings" className="text-sm text-gold hover:underline">
          ← All bookings
        </Link>
        <h2 className="mt-2 font-display text-2xl font-bold text-white">{booking.reference_no}</h2>
        <p className="mt-1 text-sm capitalize text-zinc-400">
          Status: {booking.status.replace("_", " ")} · Source: {booking.source}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <InfoCard title="Customer">
            <Row label="Name" value={booking.customer_name} />
            <Row label="Phone" value={`+91 ${booking.phone}`} />
            <Row label="Email" value={booking.email || "—"} />
            <Row label="Guests" value={booking.guests != null ? String(booking.guests) : "—"} />
          </InfoCard>
          <InfoCard title="Trip / van">
            <Row label="Van name" value={booking.vehicle_name} />
            <Row label="Destination" value={booking.destination} />
            <Row label="Pickup date" value={booking.pickup_date} />
            <Row label="Return date" value={booking.return_date} />
            <Row label="Price" value={formatInr(booking.quoted_amount)} />
            <Row label="Customer notes" value={booking.message || "—"} />
          </InfoCard>
        </div>
        <div className="lg:col-span-2">
          <BookingStatusForm
            bookingId={booking.id}
            status={booking.status}
            adminNotes={booking.admin_notes || ""}
            quotedAmount={booking.quoted_amount || ""}
            customerName={booking.customer_name}
            phone={booking.phone}
            email={booking.email || ""}
            vehicleName={booking.vehicle_name}
            pickupDate={booking.pickup_date}
            returnDate={booking.return_date}
            destination={booking.destination}
            reference={booking.reference_no}
            confirmedAt={booking.confirmed_at}
            confirmationWhatsappSent={booking.confirmation_whatsapp_sent}
            confirmationEmailSent={booking.confirmation_email_sent}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-charcoal-light p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <dl className="mt-4 space-y-3">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-200">{value}</dd>
    </div>
  );
}
