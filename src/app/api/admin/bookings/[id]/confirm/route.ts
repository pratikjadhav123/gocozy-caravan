import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { confirmBooking, getBookingById } from "@/lib/bookings";
import {
  buildConfirmationMessage,
  customerWhatsAppConfirmUrl,
  sendConfirmationEmail,
} from "@/lib/confirmation";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    price?: number | string;
    admin_notes?: string;
    sendWhatsApp?: boolean;
    sendEmail?: boolean;
  };

  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid booking price (INR) before confirming" },
      { status: 400 }
    );
  }

  const existing = await getBookingById(Number(id));
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
  }

  let emailResult: { sent: boolean; reason?: string } = { sent: false, reason: "skipped" };
  if (body.sendEmail !== false) {
    emailResult = await sendConfirmationEmail(
      { ...existing, quoted_amount: String(price) },
      price
    );
  }

  const booking = await confirmBooking(
    Number(id),
    {
      price,
      adminNotes: body.admin_notes,
      whatsappSent: body.sendWhatsApp !== false,
      emailSent: emailResult.sent,
    },
    admin.id
  );

  if (!booking) {
    return NextResponse.json({ ok: false, error: "Could not confirm booking" }, { status: 500 });
  }

  const whatsappUrl = customerWhatsAppConfirmUrl(booking, price);
  const message = buildConfirmationMessage(booking, price);

  return NextResponse.json({
    ok: true,
    booking,
    whatsappUrl,
    message,
    email: emailResult,
  });
}
