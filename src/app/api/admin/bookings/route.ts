import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listBookings } from "@/lib/bookings";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bookings = await listBookings({
    status: searchParams.get("status") || undefined,
    q: searchParams.get("q") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    limit: Number(searchParams.get("limit") || 100),
  });

  return NextResponse.json({ ok: true, bookings });
}
