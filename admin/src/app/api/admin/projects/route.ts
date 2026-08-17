import { NextResponse } from "next/server";
import { requireModule } from "@/lib/auth";
import { db } from "@/lib/db";

const STATUSES = ["Active", "Paused", "Done"];
const KINDS = ["update", "blocker", "milestone"];
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(req: Request) {
  let session;
  try { session = await requireModule("projects"); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const b = await req.json().catch(() => ({}));
  const id = Number(b.id);
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 200) : undefined;
  const status = typeof b.status === "string" ? b.status : undefined;

  if (b.action === "create") {
    if (!name) return bad("Name required");
    if (status && !STATUSES.includes(status)) return bad("Bad status");
    const p = await db.project.create({ data: { name, status: status ?? "Active" } });
    return NextResponse.json({ ok: true, id: p.id });
  }
  if (b.action === "update") {
    if (!Number.isInteger(id)) return bad("Bad id");
    if (status !== undefined && !STATUSES.includes(status)) return bad("Bad status");
    if (name !== undefined && !name) return bad("Name required");
    if (name === undefined && status === undefined) return bad("Nothing to update");
    await db.project.update({ where: { id }, data: { ...(name !== undefined && { name }), ...(status !== undefined && { status }) } });
    return NextResponse.json({ ok: true });
  }
  if (b.action === "delete") {
    if (!Number.isInteger(id)) return bad("Bad id");
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  if (b.action === "update.add") {
    const projectId = Number(b.projectId);
    const body = typeof b.body === "string" ? b.body.trim().slice(0, 5000) : "";
    const kind = typeof b.kind === "string" ? b.kind : "update";
    if (!Number.isInteger(projectId)) return bad("Bad projectId");
    if (!body) return bad("Body required");
    if (!KINDS.includes(kind)) return bad("Bad kind");
    await db.projectUpdate.create({ data: { projectId, body, kind, authorName: session.name } });
    return NextResponse.json({ ok: true });
  }
  if (b.action === "update.delete") {
    if (!Number.isInteger(id)) return bad("Bad id");
    await db.projectUpdate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  return bad("Bad action");
}
