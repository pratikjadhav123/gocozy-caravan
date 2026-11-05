"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DESTINATIONS,
  SITE,
  VEHICLES,
  getVehicle,
  vehicleCapacityLabel,
  whatsappUrl,
} from "@/lib/constants";

type FormState = {
  name: string;
  phone: string;
  email: string;
  guests: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  destination: string;
  message: string;
};

type BookingFormProps = {
  defaultVehicleId?: string;
  defaultDestination?: string;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatDisplayDate(iso: string) {
  if (!iso) return iso;
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function openWhatsApp(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function BookingForm({ defaultVehicleId, defaultDestination }: BookingFormProps) {
  const resolvedVehicleId = useMemo(() => {
    if (defaultVehicleId && getVehicle(defaultVehicleId)) return getVehicle(defaultVehicleId)!.id;
    return VEHICLES[0].id;
  }, [defaultVehicleId]);

  const resolvedDestination = useMemo(() => {
    if (!defaultDestination) return DESTINATIONS[0];
    const exact = DESTINATIONS.find(
      (d) => d.toLowerCase() === defaultDestination.toLowerCase()
    );
    if (exact) return exact;
    const partial = DESTINATIONS.find((d) =>
      defaultDestination.toLowerCase().includes(d.toLowerCase())
    );
    return partial ?? defaultDestination;
  }, [defaultDestination]);

  const destinationOptions = useMemo(() => {
    if (DESTINATIONS.includes(resolvedDestination as (typeof DESTINATIONS)[number])) {
      return [...DESTINATIONS];
    }
    return [resolvedDestination, ...DESTINATIONS];
  }, [resolvedDestination]);

  const blankForm = useMemo<FormState>(
    () => ({
      name: "",
      phone: "",
      email: "",
      guests: "",
      vehicleId: resolvedVehicleId,
      pickupDate: "",
      returnDate: "",
      destination: resolvedDestination,
      message: "",
    }),
    [resolvedVehicleId, resolvedDestination]
  );

  const [form, setForm] = useState<FormState>(blankForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [waHref, setWaHref] = useState("");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      vehicleId: resolvedVehicleId,
      destination: resolvedDestination,
    }));
  }, [resolvedVehicleId, resolvedDestination]);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required";

    const phoneDigits = digitsOnly(form.phone);
    if (!form.phone.trim()) next.phone = "Phone is required";
    else if (phoneDigits.length !== 10) next.phone = "Enter a valid 10-digit mobile number";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (form.guests && (!/^\d+$/.test(form.guests) || Number(form.guests) < 1)) {
      next.guests = "Enter guest count as a number";
    }
    if (!form.vehicleId || !getVehicle(form.vehicleId)) next.vehicleId = "Select a vehicle";
    if (!form.pickupDate) next.pickupDate = "Pick-up date is required";
    if (!form.returnDate) next.returnDate = "Return date is required";
    if (form.pickupDate && form.returnDate && form.returnDate < form.pickupDate) {
      next.returnDate = "Return must be on or after pick-up";
    }
    if (!form.destination.trim()) next.destination = "Destination is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const vehicle = getVehicle(form.vehicleId) ?? VEHICLES[0];
    const phoneDigits = digitsOnly(form.phone);
    const text = [
      `Hi ${SITE.name}, I want to book a caravan.`,
      "",
      `Name: ${form.name.trim()}`,
      `Phone: +91 ${phoneDigits}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      form.guests.trim() ? `Guests: ${form.guests.trim()}` : null,
      `Vehicle: ${vehicle.name} (${vehicleCapacityLabel(vehicle)})`,
      `Pick-up: ${formatDisplayDate(form.pickupDate)}`,
      `Return: ${formatDisplayDate(form.returnDate)}`,
      `Destination: ${form.destination.trim()}`,
      form.message.trim() ? `Notes: ${form.message.trim()}` : null,
      "",
      "Please confirm availability and pricing. Thank you!",
    ]
      .filter((line) => line !== null)
      .join("\n");

    const href = whatsappUrl(text);
    setWaHref(href);
    setStatus("success");
    openWhatsApp(href);
    setForm(blankForm);
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
          <p className="text-lg font-semibold text-gold">WhatsApp booking ready</p>
          <p className="mt-2 text-sm text-zinc-400">
            If WhatsApp did not open, tap the button below. Send the pre-filled message to confirm
            your slot.
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
                required
              />
            )}
            {field(
              "phone",
              "Mobile number *",
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                className="input-field"
                placeholder="10-digit number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                autoComplete="tel"
                required
              />
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
              "guests",
              "Guests (optional)",
              <input
                id="guests"
                type="number"
                min={1}
                max={20}
                className="input-field"
                placeholder="e.g. 4"
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
              />
            )}
          </div>

          {field(
            "vehicleId",
            "Caravan *",
            <select
              id="vehicleId"
              className="input-field"
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              required
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
                onChange={(e) => {
                  const pickupDate = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    pickupDate,
                    returnDate:
                      prev.returnDate && prev.returnDate < pickupDate
                        ? pickupDate
                        : prev.returnDate,
                  }));
                }}
                required
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
                required
              />
            )}
          </div>

          {field(
            "destination",
            "Preferred destination *",
            <select
              id="destination"
              className="input-field"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              required
            >
              {destinationOptions.map((d) => (
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
              placeholder="Pick-up city, special requests..."
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
            Submitting opens WhatsApp with your booking details to {SITE.phoneDisplay}. No payment
            on the website.
          </p>
        </form>
      )}
    </div>
  );
}
