"use client";

import { useState } from "react";
import { SITE, whatsappUrl } from "@/lib/constants";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim()) e.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ""))) {
      e.phone = "Enter a valid 10-digit number";
    }
    if (!message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, subject, message }),
      });
      const data = (await res.json()) as { ok: boolean };
      if (!res.ok || !data.ok) throw new Error("Failed");
      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const wa = whatsappUrl(
    `Hi ${SITE.name}, ${name || "I"} wrote: ${message || subject || "Please call me back."}`
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-charcoal-light/80 p-6 sm:p-8">
      {status === "success" ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-gold">Message sent</p>
          <p className="mt-2 text-sm text-zinc-400">We will reply within 24 hours.</p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
          >
            Chat on WhatsApp
          </a>
          <button
            type="button"
            className="mt-4 block w-full text-sm text-zinc-500 underline"
            onClick={() => setStatus("idle")}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Name *
              </label>
              <input
                id="contact-name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name ? <p className="mt-1 text-sm text-red-400">{errors.name}</p> : null}
            </div>
            <div>
              <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-zinc-300">
                Phone *
              </label>
              <input
                id="contact-phone"
                type="tel"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone ? <p className="mt-1 text-sm text-red-400">{errors.phone}</p> : null}
            </div>
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Subject
            </label>
            <input
              id="contact-subject"
              className="input-field"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Message *
            </label>
            <textarea
              id="contact-message"
              rows={5}
              className="input-field resize-y"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message ? <p className="mt-1 text-sm text-red-400">{errors.message}</p> : null}
          </div>
          {status === "error" ? (
            <p className="text-sm text-red-400">Could not send. Try WhatsApp or email us.</p>
          ) : null}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-gold py-3.5 text-sm font-bold text-charcoal disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
