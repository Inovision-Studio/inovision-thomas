import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json().catch(() => ({}));

  switch (b.action) {
    case "addStaff": {
      const name = String(b.name ?? "").trim();
      const pin = String(b.pin ?? "").trim();
      if (!name || !pin) return NextResponse.json({ error: "Name and PIN required" }, { status: 400 });
      await db.staffMember.create({ data: { name, pinHash: bcrypt.hashSync(pin, 10), active: true } });
      break;
    }
    case "toggleStaff":
      await db.staffMember.update({ where: { id: Number(b.id) }, data: { active: !!b.active } });
      break;
    case "deleteStaff":
      await db.staffMember.delete({ where: { id: Number(b.id) } });
      break;
    case "addTask": {
      const text = String(b.text ?? "").trim();
      if (!text) return NextResponse.json({ error: "Task text required" }, { status: 400 });
      await db.staffTask.create({ data: { text } });
      break;
    }
    case "toggleTask": {
      const done = !!b.done;
      await db.staffTask.update({
        where: { id: Number(b.id) },
        data: { done, doneBy: done ? "Owner" : null, doneAt: done ? new Date() : null },
      });
      break;
    }
    case "deleteTask":
      await db.staffTask.delete({ where: { id: Number(b.id) } });
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  revalidatePath("/admin/staff");
  return NextResponse.json({ ok: true });
}
