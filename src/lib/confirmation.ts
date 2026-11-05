import nodemailer from "nodemailer";
import { SITE } from "@/lib/constants";
import type { BookingRow } from "@/lib/bookings";

function formatInr(amount: number | string) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "To be confirmed";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function buildConfirmationMessage(booking: BookingRow, price: number) {
  return [
    `✅ Booking Confirmed — ${SITE.name}`,
    "",
    `Hi ${booking.customer_name},`,
    `Your caravan booking is confirmed.`,
    "",
    `Reference: ${booking.reference_no}`,
    `Van: ${booking.vehicle_name}`,
    `Pickup: ${booking.pickup_date}`,
    `Return: ${booking.return_date}`,
    `Destination: ${booking.destination}`,
    booking.guests != null ? `Guests: ${booking.guests}` : null,
    `Price: ${formatInr(price)}`,
    "",
    `Need help? WhatsApp/Call ${SITE.phoneDisplay}`,
    `Email: ${SITE.email}`,
    `Instagram: ${SITE.instagram}`,
    "",
    "Thank you for choosing Go Cozy Caravan!",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function customerWhatsAppConfirmUrl(booking: BookingRow, price: number) {
  const phone = booking.phone.replace(/\D/g, "");
  const full = phone.length === 10 ? `91${phone}` : phone;
  const text = buildConfirmationMessage(booking, price);
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendConfirmationEmail(booking: BookingRow, price: number) {
  if (!booking.email?.trim()) {
    return { sent: false as const, reason: "Customer email missing" };
  }
  if (!isSmtpConfigured()) {
    return { sent: false as const, reason: "SMTP not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const body = buildConfirmationMessage(booking, price);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${SITE.name}" <${SITE.email}>`,
    to: booking.email.trim(),
    subject: `Booking confirmed ${booking.reference_no} — ${SITE.name}`,
    text: body,
  });

  return { sent: true as const };
}
