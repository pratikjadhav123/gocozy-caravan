import { NextResponse } from "next/server";
import { saveBooking } from "@/lib/bookings-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      vehicleId?: string;
      pickupDate?: string;
      returnDate?: string;
      destination?: string;
      message?: string;
    };

    if (!body.name?.trim() || !body.phone?.trim() || !body.pickupDate || !body.returnDate) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const phone = body.phone.replace(/\D/g, "");
    if (phone.length !== 10) {
      return NextResponse.json({ ok: false, error: "Invalid phone" }, { status: 400 });
    }

    if (body.returnDate < body.pickupDate) {
      return NextResponse.json({ ok: false, error: "Invalid dates" }, { status: 400 });
    }

    const record = await saveBooking({
      name: body.name.trim(),
      phone,
      email: body.email?.trim() ?? "",
      vehicleId: body.vehicleId ?? "cozy-premium",
      pickupDate: body.pickupDate,
      returnDate: body.returnDate,
      destination: body.destination ?? "",
      message: body.message?.trim() ?? "",
    });

    return NextResponse.json({ ok: true, reference: record.reference });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
