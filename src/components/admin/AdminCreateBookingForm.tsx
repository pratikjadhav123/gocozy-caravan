"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DESTINATIONS, VEHICLES, vehicleCapacityLabel } from "@/lib/constants";

type Props = {
  enquiryId?: number;
  defaultName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
  defaultMessage?: string;
};

export function AdminCreateBookingForm({
  enquiryId,
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
  defaultMessage = "",
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [email, setEmail] = useState(defaultEmail);
  const [guests, setGuests] = useState("");
  const [vehicleId, setVehicleId] = useState<string>(VEHICLES[0].id);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [destination, setDestination] = useState<string>(DESTINATIONS[0]);
  const [message, setMessage] = useState(defaultMessage);
  const [quotedAmount, setQuotedAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enquiryId,
        name,
        phone,
        email,
        guests,
        vehicleId,
        pickupDate,
        returnDate,
        destination,
        message,
        quotedAmount,
        closeEnquiry: true,
      }),
    });
    const data = (await res.json()) as {
      ok: boolean;
      error?: string;
      bookingId?: number;
      reference?: string;
    };
    setSaving(false);

    if (!res.ok || !data.ok || !data.bookingId) {
      setError(data.error || "Could not create booking");
      return;
    }

    router.push(`/admin/bookings/${data.bookingId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5 sm:p-6">
      {enquiryId ? (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold">
          Booking from enquiry #{enquiryId}. After save, enquiry will be marked Closed.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Customer name *">
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Phone *">
          <input
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="10-digit mobile"
          />
        </Field>
        <Field label="Email">
          <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Guests">
          <input
            className="input-field"
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Van *">
        <select className="input-field" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
          {VEHICLES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — {vehicleCapacityLabel(v)}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pickup date *">
          <input
            className="input-field"
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            required
          />
        </Field>
        <Field label="Return date *">
          <input
            className="input-field"
            type="date"
            value={returnDate}
            min={pickupDate || undefined}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Destination *">
          <select
            className="input-field"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            {DESTINATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Price INR (optional)">
          <input
            className="input-field"
            type="number"
            min={1}
            value={quotedAmount}
            onChange={(e) => setQuotedAmount(e.target.value)}
            placeholder="e.g. 18000"
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          className="input-field min-h-24 resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pickup point, discussion notes…"
        />
      </Field>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-gold py-3.5 text-sm font-bold text-charcoal transition hover:bg-gold-light disabled:opacity-60"
      >
        {saving ? "Creating booking…" : "Create booking in CRM"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
