import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

// CSV cell escaping: wrap in quotes, double embedded quotes.
function cell(v: unknown) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [vip, subs] = await Promise.all([
    db.vipMember.findMany({ orderBy: { createdAt: "desc" } }),
    db.newsletterSub.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const lines: string[] = ["list,email,coupon_won,date"];
  for (const m of vip) lines.push(["vip", m.email, m.couponWon || "", m.createdAt.toISOString()].map(cell).join(","));
  for (const s of subs) lines.push(["newsletter", s.email, "", s.createdAt.toISOString()].map(cell).join(","));

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mibudz-emails.csv"`,
    },
  });
}
