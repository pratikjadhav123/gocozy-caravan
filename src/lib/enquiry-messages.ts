import { SITE } from "@/lib/constants";

export function buildEnquiryReplyWhatsApp(input: {
  name: string;
  phone: string;
  reference: string;
  message?: string | null;
}) {
  const phone = input.phone.replace(/\D/g, "");
  const full = phone.length === 10 ? `91${phone}` : phone;
  const text = [
    `Hi ${input.name}! 👋`,
    "",
    `Welcome to ${SITE.name}.`,
    `Thanks for your enquiry (${input.reference}).`,
    input.message?.trim() ? `We received: "${input.message.trim()}"` : null,
    "",
    "Our team is happy to help you book the right Go Cozy van.",
    "Please share your preferred dates, destination, and guest count.",
    "",
    `Call / WhatsApp: ${SITE.phoneDisplay}`,
    `— ${SITE.name} Admin`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}
