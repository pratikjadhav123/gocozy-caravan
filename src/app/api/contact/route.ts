import { NextResponse } from "next/server";
import { saveContact } from "@/lib/bookings-store";

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

    await saveContact({
      name: body.name.trim(),
      phone,
      email: body.email?.trim() ?? "",
      subject: body.subject?.trim() ?? "",
      message: body.message.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
