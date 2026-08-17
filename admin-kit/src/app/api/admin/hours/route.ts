import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json().catch(() => ({}));
  const hours: Array<{ day: number; closed: boolean; open: string; close: string }> = Array.isArray(b.hours) ? b.hours : [];
  await db.$transaction(
    hours
      .filter((h) => h.day >= 0 && h.day <= 6)
      .map((h) =>
        db.businessHour.upsert({
          where: { day: h.day },
          update: { closed: !!h.closed, open: String(h.open ?? ""), close: String(h.close ?? "") },
          create: { day: h.day, closed: !!h.closed, open: String(h.open ?? ""), close: String(h.close ?? "") },
        }),
      ),
  );
  revalidatePath("/admin/staff");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
