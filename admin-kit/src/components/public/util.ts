import { TIMEZONE } from "@/lib/site";
import type { BusinessHour } from "@prisma/client";

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Price with the .00 trimmed, plus range support. */
export function formatPrice(min: number, max?: number | null): string {
  const n = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
  if (max != null && max !== min) return `$${n(min)}–$${n(max)}`;
  return `$${n(min)}`;
}

/** "9 AM", "10 PM", "12 AM" → minutes since midnight, or null. */
function parseTime(t: string): number | null {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

/** Current weekday (0=Sun) and minutes-since-midnight in the store timezone (TIMEZONE). */
export function nowLocal(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = Math.max(0, DAY_SHORT.indexOf(get("weekday")));
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  return { day, minutes: hour * 60 + minute };
}

export type OpenState = { open: boolean; label: string };

// ponytail: naive same-day window; a past-midnight "12 AM" close is treated as
// end-of-today, and hours that start before midnight aren't carried into the
// next day. Fine for standard shop hours; revisit if true overnight hours land.
export function computeOpen(hours: BusinessHour[]): OpenState {
  const { day, minutes } = nowLocal();
  const today = hours.find((h) => h.day === day);
  // Labels are rendered after an "Open"/"Closed" word, so they must not repeat it.
  if (!today || today.closed) return { open: false, label: "all day" };
  const o = parseTime(today.open);
  let c = parseTime(today.close);
  if (o == null || c == null) return { open: false, label: "" };
  if (c <= o) c += 1440; // e.g. closes "12 AM" (midnight)
  const open = minutes >= o && minutes < c;
  return open
    ? { open: true, label: `until ${today.close}` }
    : { open: false, label: minutes < o ? `opens ${today.open}` : "" };
}
