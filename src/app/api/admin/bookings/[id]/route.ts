import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getBookingById, updateBooking, type BookingStatus } from "@/lib/bookings";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const booking = await getBookingById(Number(id));
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, booking });
}

export async function PATCH(request: Request, context: Ctx) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: BookingStatus;
    admin_notes?: string;
    quoted_amount?: number | null;
  };

  const booking = await updateBooking(
    Number(id),
    {
      status: body.status,
      admin_notes: body.admin_notes,
      quoted_amount: body.quoted_amount,
    },
    admin.id
  );

  if (!booking) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, booking });
}
