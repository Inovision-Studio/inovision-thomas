import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
const COOKIE = "mb_session";

export type Session = { role: "owner" | "staff"; staffId?: number; name?: string };

export async function createSession(payload: Session) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Session;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function verifyOwnerPassword(password: string): Promise<boolean> {
  const s = await db.setting.findUnique({ where: { key: "owner_password_hash" } });
  if (!s?.value) return false;
  return bcrypt.compareSync(password, s.value);
}

export async function setOwnerPassword(password: string) {
  const hash = bcrypt.hashSync(password, 10);
  await db.setting.upsert({ where: { key: "owner_password_hash" }, update: { value: hash }, create: { key: "owner_password_hash", value: hash } });
}

export async function requireOwner(): Promise<Session> {
  const s = await getSession();
  if (!s || s.role !== "owner") throw new Error("UNAUTHORIZED");
  return s;
}
