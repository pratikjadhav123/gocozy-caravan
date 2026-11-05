import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listContacts, updateContactStatus } from "@/lib/bookings";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const contacts = await listContacts();
  return NextResponse.json({ ok: true, contacts });
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: number;
    status?: "new" | "replied" | "closed";
    admin_notes?: string;
  };

  if (!body.id || !body.status) {
    return NextResponse.json({ ok: false, error: "id and status required" }, { status: 400 });
  }

  await updateContactStatus(body.id, body.status, body.admin_notes);
  return NextResponse.json({ ok: true });
}
