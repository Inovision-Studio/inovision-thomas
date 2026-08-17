import { NextResponse } from "next/server";
import { hashPassword, requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";
import { MODULES, OWNER_ONLY } from "@/lib/modules";

const GRANTABLE = new Set(MODULES.map((m) => m.key).filter((k) => k !== "dashboard" && !OWNER_ONLY.has(k)));
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const cleanPerms = (p: unknown) => Array.isArray(p) ? [...new Set(p.filter((k): k is string => typeof k === "string" && GRANTABLE.has(k)))] : null;
const cleanRole = (r: unknown) => (r === "owner" || r === "staff" ? r : null);
const cleanPassword = (p: unknown) => (typeof p === "string" && p.length >= 8 && p.length <= 128 ? p : null);

export async function POST(req: Request) {
  let session;
  try { session = await requireOwner(); } catch { return bad("Unauthorized", 401); }
  const body = await req.json().catch(() => ({}));
  const { action } = body;

  if (action === "create") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim().slice(0, 120);
    const password = cleanPassword(body.password);
    const role = cleanRole(body.role);
    const permissions = cleanPerms(body.permissions ?? []);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return bad("Invalid email");
    if (!password) return bad("Password must be 8-128 characters");
    if (!role || !permissions) return bad("Bad role or permissions");
    if (await db.admin.findUnique({ where: { email } })) return bad("An admin with that email already exists", 409);
    const a = await db.admin.create({ data: { email, name, passwordHash: await hashPassword(password), role, permissions, createdBy: session.email } });
    return NextResponse.json({ ok: true, id: a.id });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id)) return bad("Bad id");
  const target = await db.admin.findUnique({ where: { id } });
  if (!target) return bad("Not found", 404);
  const isSelf = target.id === session.adminId;
  const lastOwner = async () => target.role === "owner" && (await db.admin.count({ where: { role: "owner", disabled: false } })) <= 1;

  if (action === "update") {
    const data: { name?: string; role?: string; permissions?: string[]; disabled?: boolean } = {};
    if (body.name !== undefined) data.name = String(body.name).trim().slice(0, 120);
    if (body.role !== undefined) {
      const role = cleanRole(body.role);
      if (!role) return bad("Bad role");
      if (role === "staff" && isSelf) return bad("You cannot demote yourself");
      if (role === "staff" && (await lastOwner())) return bad("Cannot demote the last owner");
      data.role = role;
    }
    if (body.permissions !== undefined) {
      const permissions = cleanPerms(body.permissions);
      if (!permissions) return bad("Bad permissions");
      data.permissions = permissions;
    }
    if (body.disabled !== undefined) {
      const disabled = Boolean(body.disabled);
      if (disabled && isSelf) return bad("You cannot disable yourself");
      if (disabled && (await lastOwner())) return bad("Cannot disable the last owner");
      data.disabled = disabled;
    }
    await db.admin.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  }

  if (action === "resetPassword") {
    const password = cleanPassword(body.password);
    if (!password) return bad("Password must be 8-128 characters");
    await db.admin.update({ where: { id }, data: { passwordHash: await hashPassword(password) } });
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    if (isSelf) return bad("You cannot delete yourself");
    if (await lastOwner()) return bad("Cannot delete the last owner");
    await db.admin.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  return bad("Bad action");
}
