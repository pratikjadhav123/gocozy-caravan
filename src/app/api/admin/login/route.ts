import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  findAdminByEmail,
  setAdminCookie,
  touchAdminLogin,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email?.trim() || !body.password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }

    const admin = await findAdminByEmail(body.email);
    if (!admin || !admin.is_active) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyAdminPassword(body.password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const session = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
    const token = await createAdminSessionToken(session);
    await setAdminCookie(token);
    await touchAdminLogin(admin.id);

    return NextResponse.json({ ok: true, admin: session });
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json(
      { ok: false, error: "Login failed. Check database connection." },
      { status: 500 }
    );
  }
}
