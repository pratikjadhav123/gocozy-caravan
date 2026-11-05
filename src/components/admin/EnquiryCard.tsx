"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildEnquiryReplyWhatsApp } from "@/lib/enquiry-messages";

type Props = {
  id: number;
  reference: string;
  status: "new" | "replied" | "closed";
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
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

export function EnquiryCard(props: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(props.status);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const phoneDisplay = `+91 ${props.phone}`;

  async function patchStatus(next: Props["status"]) {
    setBusy(true);
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.id, status: next }),
    });
    setStatus(next);
    setBusy(false);
    router.refresh();
  }

  async function replyOnWhatsApp() {
    const href = buildEnquiryReplyWhatsApp({
      name: props.name,
      phone: props.phone,
      reference: props.reference,
      message: props.message,
    });
    openUrl(href);
    if (status !== "replied" && status !== "closed") {
      await patchStatus("replied");
    }
  }

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(props.phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy phone number", props.phone);
    }
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-charcoal-light p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gold">{props.reference}</p>
          <h3 className="mt-1 font-display text-lg font-bold text-white">{props.name}</h3>
          <p className="mt-1 text-sm text-zinc-300">
            {phoneDisplay}
            {props.email ? ` · ${props.email}` : ""}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            status === "new"
              ? "bg-gold/15 text-gold"
              : status === "replied"
                ? "bg-sky-500/15 text-sky-300"
                : "bg-zinc-500/20 text-zinc-300"
          }`}
        >
          {status}
        </span>
      </div>

      {props.subject ? <p className="mt-3 text-sm font-medium text-zinc-200">{props.subject}</p> : null}
      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-400">{props.message}</p>
      <p className="mt-3 text-xs text-zinc-600">{props.createdAt}</p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
        <button
          type="button"
          disabled={busy}
          onClick={replyOnWhatsApp}
          className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          Reply on WhatsApp
        </button>

        <button
          type="button"
          onClick={copyPhone}
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-gold hover:text-gold"
        >
          {copied ? "Phone copied" : "Copy phone"}
        </button>

        <a
          href={`tel:+91${props.phone}`}
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-gold hover:text-gold"
        >
          Call customer
        </a>

        <Link
          href={`/admin/bookings/new?enquiryId=${props.id}`}
          className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal transition hover:bg-gold-light"
        >
          Book this customer
        </Link>

        {status !== "closed" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => patchStatus("closed")}
            className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            Close enquiry
          </button>
        ) : null}

        {status === "closed" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => patchStatus("new")}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-300 disabled:opacity-60"
          >
            Reopen
          </button>
        ) : null}
      </div>
    </article>
  );
}
