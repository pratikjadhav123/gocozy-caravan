import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  createBooking,
  getContactById,
  updateContactStatus,
} from "@/lib/bookings";
import { getVehicle } from "@/lib/constants";

export async function POST(request: Request) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      enquiryId?: number;
      name?: string;
      phone?: string;
      email?: string;
      guests?: number | string | null;
      vehicleId?: string;
      pickupDate?: string;
      returnDate?: string;
      destination?: string;
      message?: string;
      quotedAmount?: number | string | null;
      closeEnquiry?: boolean;
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

    const guestsRaw =
      body.guests === "" || body.guests == null ? null : Number(body.guests);

    const booking = await createBooking({
      name: body.name.trim(),
      phone,
      email: body.email?.trim() || "",
      guests: guestsRaw != null && Number.isFinite(guestsRaw) ? guestsRaw : null,
      vehicleId,
      pickupDate: body.pickupDate,
      returnDate: body.returnDate,
      destination: body.destination?.trim() || "Custom / Other (India)",
      message: [
        body.message?.trim() || "",
        body.enquiryId ? `Converted from enquiry #${body.enquiryId}` : "",
        `Created by admin ${admin.email}`,
      ]
        .filter(Boolean)
        .join("\n"),
      whatsappSent: false,
      source: "admin_crm",
    });

    const amount = body.quotedAmount == null || body.quotedAmount === "" ? null : Number(body.quotedAmount);
    if (amount != null && Number.isFinite(amount) && amount > 0) {
      const { queryExec } = await import("@/lib/db");
      await queryExec(
        `UPDATE bookings SET quoted_amount = :amount, assigned_admin_id = :admin_id WHERE id = :id`,
        { id: booking.id, amount, admin_id: admin.id }
      );
    } else {
      const { queryExec } = await import("@/lib/db");
      await queryExec(`UPDATE bookings SET assigned_admin_id = :admin_id WHERE id = :id`, {
        id: booking.id,
        admin_id: admin.id,
      });
    }

    if (body.enquiryId) {
      const enquiry = await getContactById(Number(body.enquiryId));
      if (enquiry && body.closeEnquiry !== false) {
        await updateContactStatus(
          enquiry.id,
          "closed",
          `Booked as ${booking.reference_no}`
        );
      }
    }

    return NextResponse.json({
      ok: true,
      reference: booking.reference_no,
      bookingId: booking.id,
    });
  } catch (err) {
    console.error("[admin/bookings]", err);
    return NextResponse.json({ ok: false, error: "Could not create booking" }, { status: 500 });
  }
}
