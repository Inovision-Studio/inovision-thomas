import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import StaffClient from "./StaffClient";

export const dynamic = "force-dynamic";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Punch = { kind: string; at: Date };

// Naive pairing: walk punches oldest→newest, sum each in→out span.
// ponytail: assumes clean in/out alternation; a dangling "in" is ignored.
function weeklyHours(punches: Punch[]): number {
  let ms = 0;
  let inAt: number | null = null;
  for (const p of punches) {
    if (p.kind === "in") inAt = p.at.getTime();
    else if (p.kind === "out" && inAt != null) {
      ms += p.at.getTime() - inAt;
      inAt = null;
    }
  }
  return Math.round((ms / 3_600_000) * 10) / 10;
}

export default async function StaffPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 3_600_000);
  const [hourRows, staff, tasks] = await Promise.all([
    db.businessHour.findMany(),
    db.staffMember.findMany({
      orderBy: { id: "asc" },
      include: { punches: { where: { at: { gte: weekAgo } }, orderBy: { at: "asc" } } },
    }),
    db.staffTask.findMany({ orderBy: { id: "asc" } }),
  ]);

  const byDay = new Map(hourRows.map((h) => [h.day, h]));
  const hours = DAYS.map((label, day) => {
    const h = byDay.get(day);
    return { day, label, closed: h?.closed ?? false, open: h?.open ?? "", close: h?.close ?? "" };
  });

  const staffView = staff.map((s) => ({
    id: s.id,
    name: s.name,
    active: s.active,
    weeklyHours: weeklyHours(s.punches),
  }));

  return (
    <div>
      <PageHeader title="Staff & Hours" sub="Business hours, staff accounts, and the shared task list." />
      <StaffClient hours={hours} staff={staffView} tasks={tasks} />
    </div>
  );
}
