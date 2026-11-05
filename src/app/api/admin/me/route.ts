import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await readAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, admin: session });
}
