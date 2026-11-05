import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { RowDataPacket } from "mysql2";
import { queryRows, queryExec } from "@/lib/db";

export const ADMIN_COOKIE = "gocozy_admin_session";
const SESSION_DAYS = 7;

export type AdminSession = {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "staff";
};

type AdminRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: AdminSession["role"];
  is_active: number;
};

function secretKey() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET must be set (min 32 characters) in .env.local");
  }
  return new TextEncoder().encode(secret);
}

export async function findAdminByEmail(email: string): Promise<AdminRow | null> {
  const rows = await queryRows<AdminRow[]>(
    `SELECT id, name, email, password_hash, role, is_active
     FROM admins WHERE email = :email LIMIT 1`,
    { email: email.trim().toLowerCase() }
  );
  return rows[0] ?? null;
}

export async function verifyAdminPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createAdminSessionToken(admin: AdminSession): Promise<string> {
  return new SignJWT({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function readAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.id || !payload.email) return null;
    return {
      id: Number(payload.id),
      name: String(payload.name || "Admin"),
      email: String(payload.email),
      role: (payload.role as AdminSession["role"]) || "admin",
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await readAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function setAdminCookie(token: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function touchAdminLogin(adminId: number) {
  await queryExec(`UPDATE admins SET last_login_at = NOW() WHERE id = :id`, { id: adminId });
}
