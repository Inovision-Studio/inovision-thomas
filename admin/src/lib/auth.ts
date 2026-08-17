import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE = "iv_session";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export type Session = { adminId: number; email: string; name: string; role: "owner" | "staff"; permissions: string[] };

export async function createSession(s: Session) {
  const token = await new SignJWT(s).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

/** Email + password against the Admin table. Returns a session payload or null. */
export async function verifyAdmin(email: string, password: string): Promise<Session | null> {
  const a = await db.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!a || a.disabled) return null;
  if (!(await bcrypt.compare(password, a.passwordHash))) return null;
  return { adminId: a.id, email: a.email, name: a.name, role: a.role === "owner" ? "owner" : "staff", permissions: a.permissions };
}

/** Any signed-in admin. Re-reads the Admin row so demotions / permission changes /
 *  disabling take effect immediately instead of when the 30-day JWT expires. */
export async function requireAdmin(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  const a = await db.admin.findUnique({ where: { id: s.adminId }, select: { disabled: true, role: true, permissions: true, name: true, email: true } });
  if (!a || a.disabled) throw new Error("UNAUTHORIZED");
  return { ...s, name: a.name, email: a.email, role: a.role === "owner" ? "owner" : "staff", permissions: a.permissions };
}

/** Owner only (user management, money, settings). */
export async function requireOwner(): Promise<Session> {
  const s = await requireAdmin();
  if (s.role !== "owner") throw new Error("FORBIDDEN");
  return s;
}

/** Owner, or staff whose permissions include the module key. */
export async function requireModule(key: string): Promise<Session> {
  const s = await requireAdmin();
  if (s.role === "owner" || s.permissions.includes(key)) return s;
  throw new Error("FORBIDDEN");
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
