"use client";

import { useState } from "react";
import {
  DESTINATIONS,
  SITE,
  VEHICLES,
  vehicleCapacityLabel,
  whatsappUrl,
} from "@/lib/constants";

type FormState = {
  name: string;
  phone: string;
  email: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  destination: string;
  message: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  vehicleId: VEHICLES[0].id,
  pickupDate: "",
  returnDate: "",
  destination: DESTINATIONS[0],
  message: "",
};

export function BookingForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [waHref, setWaHref] = useState("");

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ""))) {
      next.phone = "Enter a valid 10-digit mobile number";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (!form.pickupDate) next.pickupDate = "Pick-up date is required";
    if (!form.returnDate) next.returnDate = "Return date is required";
    if (form.pickupDate && form.returnDate && form.returnDate < form.pickupDate) {
      next.returnDate = "Return must be on or after pick-up";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const vehicle = VEHICLES.find((v) => v.id === form.vehicleId) ?? VEHICLES[0];
    const text = [
      `Hi ${SITE.name}, I want to book a caravan.`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      `Vehicle: ${vehicle.name} (${vehicleCapacityLabel(vehicle)})`,
      `Pick-up: ${form.pickupDate}`,
      `Return: ${form.returnDate}`,
      `Destination: ${form.destination}`,
      form.message.trim() ? `Notes: ${form.message.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const href = whatsappUrl(text);
    setWaHref(href);
    setStatus("success");
    window.open(href, "_blank", "noopener,noreferrer");
    setForm(initial);
  }

  function field(id: keyof FormState, label: string, node: React.ReactNode) {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-300">
          {label}
        </label>
        {node}
        {errors[id] ? (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors[id]}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="animate-fade-up rounded-2xl border border-white/10 bg-charcoal-light/80 p-6 shadow-xl sm:p-8">
      {status === "success" ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-gold">Opening WhatsApp…</p>
          <p className="mt-2 text-sm text-zinc-400">
            Your booking details are ready. Send the message to confirm your slot with us.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:scale-105"
          >
            Continue on WhatsApp
          </a>
          <button
            type="button"
            className="mt-4 block w-full text-sm text-zinc-500 underline"
            onClick={() => setStatus("idle")}
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {field(
              "name",
              "Full name *",
              <input
                id="name"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
              />
            )}
            {field(
              "phone",
              "Mobile number *",
              <input
                id="phone"
                type="tel"
                className="input-field"
                placeholder="10-digit number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                autoComplete="tel"
              />
            )}
          </div>

          {field(
            "email",
            "Email (optional)",
            <input
              id="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          )}

          {field(
            "vehicleId",
            "Caravan *",
            <select
              id="vehicleId"
              className="input-field"
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {vehicleCapacityLabel(v)}
                </option>
              ))}
            </select>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {field(
              "pickupDate",
              "Pick-up date *",
              <input
                id="pickupDate"
                type="date"
                className="input-field"
                value={form.pickupDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
              />
            )}
            {field(
              "returnDate",
              "Return date *",
              <input
                id="returnDate"
                type="date"
                className="input-field"
                value={form.returnDate}
                min={form.pickupDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
              />
            )}
          </div>

          {field(
            "destination",
            "Preferred destination (all India)",
            <select
              id="destination"
              className="input-field"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            >
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}

          {field(
            "message",
            "Notes",
            <textarea
              id="message"
              rows={4}
              className="input-field resize-y"
              placeholder="Group size, special requests, pick-up city..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-gold py-3.5 text-sm font-bold uppercase tracking-wide text-charcoal transition hover:bg-gold-light hover:scale-[1.01] active:scale-[0.99]"
          >
            Request booking on WhatsApp
          </button>

          <p className="text-center text-xs text-zinc-500">
            Submitting opens WhatsApp with your details — no server required. We reply at{" "}
            {SITE.phoneDisplay}.
          </p>
        </form>
      )}
    </div>
  );
}
