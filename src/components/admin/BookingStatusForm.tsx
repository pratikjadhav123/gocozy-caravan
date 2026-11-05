"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BookingStatus } from "@/lib/bookings";

type Props = {
  bookingId: number;
  status: BookingStatus;
  adminNotes: string;
  quotedAmount: string;
  customerName: string;
  phone: string;
  email: string;
  vehicleName: string;
  pickupDate: string;
  returnDate: string;
  destination: string;
  reference: string;
  confirmedAt?: string | null;
  confirmationWhatsappSent?: number;
  confirmationEmailSent?: number;
};

function openUrl(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function BookingStatusForm({
  bookingId,
  status,
  adminNotes,
  quotedAmount,
  customerName,
  phone,
  email,
  vehicleName,
  pickupDate,
  returnDate,
  destination,
  reference,
  confirmedAt,
  confirmationWhatsappSent,
  confirmationEmailSent,
}: Props) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [notes, setNotes] = useState(adminNotes || "");
  const [amount, setAmount] = useState(quotedAmount || "");
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    const res = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: currentStatus,
        admin_notes: notes,
        quoted_amount: amount ? Number(amount) : null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Save failed");
      return;
    }
    setMessage("Saved");
    router.refresh();
  }

  async function confirmBooking() {
    const price = Number(amount);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter price (INR) first, then confirm");
      return;
    }

    setConfirming(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price,
          admin_notes: notes,
          sendWhatsApp: true,
          sendEmail: true,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        whatsappUrl?: string;
        email?: { sent: boolean; reason?: string };
      };

      if (!res.ok || !data.ok) {
        setError(data.error || "Confirm failed");
        setConfirming(false);
        return;
      }

      setCurrentStatus("confirmed");
      if (data.whatsappUrl) openUrl(data.whatsappUrl);

      const emailNote = data.email?.sent
        ? "Email sent to customer."
        : data.email?.reason === "Customer email missing"
          ? "No customer email — WhatsApp only."
          : data.email?.reason === "SMTP not configured"
            ? "WhatsApp opened. Add SMTP in .env.local to auto-send email."
            : "WhatsApp confirmation opened.";

      setMessage(`Booking confirmed. ${emailNote}`);
      router.refresh();
    } catch {
      setError("Network error while confirming");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-charcoal-light p-5">
      <div>
        <h3 className="font-semibold text-white">Confirm booking</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Set price → Confirm → customer gets WhatsApp (and email if SMTP is set).
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400">
        <p>
          <span className="text-zinc-500">Customer:</span> {customerName}
        </p>
        <p className="mt-1">
          <span className="text-zinc-500">Van:</span> {vehicleName}
        </p>
        <p className="mt-1">
          <span className="text-zinc-500">Pickup:</span> {pickupDate} → {returnDate}
        </p>
        <p className="mt-1">
          <span className="text-zinc-500">Destination:</span> {destination}
        </p>
        <p className="mt-1">
          <span className="text-zinc-500">Ref:</span> {reference}
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-zinc-400">Price (INR) *</label>
        <input
          className="input-field"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 18000"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-zinc-400">Admin notes</label>
        <textarea
          className="input-field min-h-24 resize-y"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Advance paid, pickup point, driver notes…"
        />
      </div>

      <button
        type="button"
        onClick={confirmBooking}
        disabled={confirming}
        className="w-full rounded-full bg-[#25D366] py-3.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {confirming ? "Confirming…" : "Confirm & send WhatsApp / Email"}
      </button>

      {confirmedAt ? (
        <p className="text-xs text-zinc-500">
          Confirmed at {confirmedAt}
          {confirmationWhatsappSent ? " · WhatsApp sent" : ""}
          {confirmationEmailSent ? " · Email sent" : ""}
          {!email ? " · No email on booking" : ""}
        </p>
      ) : null}

      <div className="border-t border-white/10 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Or update status only
        </p>
        <div className="space-y-3">
          <select
            className="input-field"
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as BookingStatus)}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save status / notes"}
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {message ? <p className="text-sm text-gold">{message}</p> : null}

      <a
        href={`https://wa.me/91${phone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-full border border-[#25D366]/40 py-3 text-sm font-semibold text-[#25D366]"
      >
        Open WhatsApp chat (+91 {phone})
      </a>
    </div>
  );
}
