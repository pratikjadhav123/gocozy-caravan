import { NextResponse } from "next/server";
import { createContact } from "@/lib/bookings";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!body.name?.trim() || !body.phone?.trim() || !body.message?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const phone = body.phone.replace(/\D/g, "");
    if (phone.length !== 10) {
      return NextResponse.json({ ok: false, error: "Invalid phone" }, { status: 400 });
    }

    const contact = await createContact({
      name: body.name.trim(),
      phone,
      email: body.email?.trim() || "",
      subject: body.subject?.trim() || "",
      message: body.message.trim(),
    });

    return NextResponse.json({
      ok: true,
      reference: contact.reference_no,
      contactId: contact.id,
    });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ ok: false, error: "Could not save enquiry" }, { status: 500 });
  }
}
