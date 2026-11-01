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
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [waHref, setWaHref] = useState("");

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

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    const text = [
      `Hi ${SITE.name}, new enquiry from the website.`,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      subject.trim() ? `Subject: ${subject.trim()}` : null,
      `Message: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const href = whatsappUrl(text);
    setWaHref(href);
    setStatus("success");
    window.open(href, "_blank", "noopener,noreferrer");
    setName("");
    setPhone("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="animate-fade-up rounded-2xl border border-white/10 bg-charcoal-light/80 p-6 sm:p-8">
      {status === "success" ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-gold">Opening WhatsApp…</p>
          <p className="mt-2 text-sm text-zinc-400">
            Your message is ready — send it on WhatsApp and we will reply soon.
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
          <button
            type="submit"
            className="w-full rounded-full bg-gold py-3.5 text-sm font-bold text-charcoal transition hover:bg-gold-light hover:scale-[1.01] active:scale-[0.99]"
          >
            Send on WhatsApp
          </button>
          <p className="text-center text-xs text-zinc-500">
            Opens WhatsApp with your message — no backend required.
          </p>
        </form>
      )}
    </div>
  );
}
