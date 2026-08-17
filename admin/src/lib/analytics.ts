import { TIMEZONE } from "./site";
import { db } from "@/lib/db";

export type Range = 7 | 30;
export type Summary = {
  range: Range;
  total: number;
  prevTotal: number;
  uniques: number;
  today: number;
  series: { day: string; views: number }[];
  topPages: { path: string; views: number }[];
  clicks: { label: string; count: number }[];
  conversions: { spins: number; vip: number; careers: number; chat: number };
  totalEvents: number;
};

const DAY = 24 * 60 * 60 * 1000;

function detroitDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Everything the dashboard shows, in one round of queries. Every query degrades to 0/[] on failure. */
export async function summary(range: Range = 30): Promise<Summary> {
  const now = new Date();
  const since = new Date(now.getTime() - range * DAY);
  const prevSince = new Date(since.getTime() - range * DAY);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const [total, prevTotal, uniqueRows, today, series, topPages, clickRows, spins, vip, careers, chat, totalEvents] = await Promise.all([
    db.event.count({ where: { kind: "pageview", createdAt: { gte: since } } }).catch(() => 0),
    db.event.count({ where: { kind: "pageview", createdAt: { gte: prevSince, lt: since } } }).catch(() => 0),
    // ponytail: distinct via findMany is fine at this scale; switch to $queryRaw COUNT(DISTINCT) past ~100k rows
    db.event.findMany({ where: { kind: "pageview", createdAt: { gte: since } }, distinct: ["visitor"], select: { visitor: true } }).catch(() => []),
    db.event.count({ where: { kind: "pageview", createdAt: { gte: startOfToday } } }).catch(() => 0),
    db.$queryRaw<{ day: string; views: bigint }[]>`
      SELECT to_char(("createdAt" AT TIME ZONE ${TIMEZONE})::date, 'YYYY-MM-DD') AS day, COUNT(*)::bigint AS views
      FROM "Event"
      WHERE kind = 'pageview' AND "createdAt" >= ${since}
      GROUP BY 1 ORDER BY 1
    `.catch(() => [] as { day: string; views: bigint }[]),
    db.event
      .groupBy({ by: ["path"], where: { kind: "pageview", createdAt: { gte: since } }, _count: { _all: true }, orderBy: { _count: { path: "desc" } }, take: 8 })
      .catch(() => []),
    db.event
      .groupBy({ by: ["label"], where: { kind: "click", createdAt: { gte: since } }, _count: { _all: true }, orderBy: { _count: { label: "desc" } }, take: 40 })
      .catch(() => []),
    db.event.count({ where: { kind: "spin", createdAt: { gte: since } } }).catch(() => 0),
    db.event.count({ where: { kind: "vip", createdAt: { gte: since } } }).catch(() => 0),
    db.event.count({ where: { kind: "careers", createdAt: { gte: since } } }).catch(() => 0),
    db.event.count({ where: { kind: "chat", createdAt: { gte: since } } }).catch(() => 0),
    db.event.count().catch(() => 0),
  ]);

  // zero-fill the day series so the chart has one bar per day
  const byDay = new Map(series.map((r) => [r.day, Number(r.views)]));
  const days: { day: string; views: number }[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = detroitDay(new Date(now.getTime() - i * DAY));
    days.push({ day: d, views: byDay.get(d) ?? 0 });
  }

  // product:* clicks roll up into one bucket so the chart isn't 30 slugs long
  const clickMap = new Map<string, number>();
  for (const r of clickRows) {
    const key = r.label.startsWith("product:") ? "product:any" : r.label;
    clickMap.set(key, (clickMap.get(key) ?? 0) + r._count._all);
  }
  const clicks = [...clickMap.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

  return {
    range,
    total,
    prevTotal,
    uniques: uniqueRows.length,
    today,
    series: days,
    topPages: topPages.map((r) => ({ path: r.path, views: r._count._all })),
    clicks,
    conversions: { spins, vip, careers, chat },
    totalEvents,
  };
}

/** Human labels for click buckets. */
export const CLICK_LABELS: Record<string, string> = {
  "cta:start": "Start a project",
  "cta:contact": "Contact",
  "cta:call": "Call",
  "cta:pricing": "See pricing",
  "cta:portal": "Client portal",
};
