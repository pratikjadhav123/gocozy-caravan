import { NextResponse } from "next/server";
import { createBooking } from "@/lib/bookings";
import { getVehicle } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      guests?: string | number;
      vehicleId?: string;
      pickupDate?: string;
      returnDate?: string;
      destination?: string;
      message?: string;
      whatsappSent?: boolean;
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

    const vehicleId = body.vehicleId || "cozy-caravan-1";
    if (!getVehicle(vehicleId)) {
      return NextResponse.json({ ok: false, error: "Invalid vehicle" }, { status: 400 });
    }

    const guestsRaw = body.guests === "" || body.guests == null ? null : Number(body.guests);
    if (guestsRaw != null && (!Number.isFinite(guestsRaw) || guestsRaw < 1)) {
      return NextResponse.json({ ok: false, error: "Invalid guests" }, { status: 400 });
    }

    const booking = await createBooking({
      name: body.name.trim(),
      phone,
      email: body.email?.trim() || "",
      guests: guestsRaw,
      vehicleId,
      pickupDate: body.pickupDate,
      returnDate: body.returnDate,
      destination: body.destination?.trim() || "Custom / Other (India)",
      message: body.message?.trim() || "",
      whatsappSent: Boolean(body.whatsappSent),
    });

    return NextResponse.json({
      ok: true,
      reference: booking.reference_no,
      bookingId: booking.id,
      status: booking.status,
    });
  } catch (err) {
    console.error("[api/book]", err);
    const message = err instanceof Error ? err.message : "Server error";
    const isConfig = message.includes("Missing env") || message.includes("ECONNREFUSED");
    return NextResponse.json(
      {
        ok: false,
        error: isConfig
          ? "Database not configured. Import database/schema.sql and set .env.local"
          : "Could not save booking",
      },
      { status: 500 }
    );
  }
}
