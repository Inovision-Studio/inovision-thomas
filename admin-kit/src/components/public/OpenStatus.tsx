import { db } from "@/lib/db";
import { computeOpen } from "./util";

/** Live Open/Closed pill computed from BusinessHour vs current store-local time. */
export default async function OpenStatus({ className = "" }: { className?: string }) {
  const hours = await db.businessHour.findMany({ orderBy: { day: "asc" } }).catch(() => []);
  const { open, label } = computeOpen(hours);
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${
        open
          ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
          : "border-white/15 bg-white/5 text-[color:var(--muted)]"
      } ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${open ? "bg-[color:var(--accent)]" : "bg-[color:var(--muted)]"}`} />
      {open ? "Open" : "Closed"}
      {label ? <span className="font-normal opacity-80">· {label}</span> : null}
    </span>
  );
}
