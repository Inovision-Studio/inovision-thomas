import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, Stat, QuickAction, Card } from "@/components/admin/ui";
import { computeOpen, DAYS, nowLocal } from "@/components/public/util";
import { getSettings } from "@/lib/settings";
import SiteHealth, { type Issue } from "@/components/admin/SiteHealth";
import { summary, CLICK_LABELS, type Range } from "@/lib/analytics";
import { Sparkline, BarChart, HBars, Delta } from "@/components/admin/charts";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { href: "/admin/products", label: "Products", hint: "Add or edit items" },
  { href: "/admin/galleries", label: "Photos", hint: "Hero & gallery images" },
  { href: "/admin/blog", label: "Blog & News", hint: "Write a post" },
  { href: "/admin/edit", label: "Edit Home", hint: "Click-to-edit the live page" },
  { href: "/admin/staff", label: "Staff & Hours", hint: "Shifts and open times" },
  { href: "/admin/settings", label: "Settings", hint: "Phone, socials, keys" },
];

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const range: Range = sp.range === "7" ? 7 : 30;
  const [products, blog, coupons, vip, openOrders, hours, recentOrders, settings, noImage, heroCount, newApps, a] = await Promise.all([
    db.product.count().catch(() => 0),
    db.blogPost.count().catch(() => 0),
    db.coupon.count().catch(() => 0),
    db.vipMember.count().catch(() => 0),
    db.order.count({ where: { status: "open" } }).catch(() => 0),
    db.businessHour.findMany({ orderBy: { day: "asc" } }).catch(() => []),
    db.order
      .findMany({ where: { status: "open" }, orderBy: { createdAt: "desc" }, take: 3 })
      .catch(() => []),
    getSettings().catch(() => ({}) as Record<string, string>),
    db.product.count({ where: { published: true, images: { isEmpty: true } } }).catch(() => 0),
    db.gallery
      .findUnique({ where: { key: "hero" }, include: { images: true } })
      .then((g) => g?.images.length ?? 0)
      .catch(() => 0),
    db.jobApplication.count({ where: { archived: false } }).catch(() => 0),
    summary(range),
  ]);

  const hasData = a.totalEvents >= 20;
  const taps = a.clicks.filter((c) => /^(cta|bar):(call|directions)$/.test(c.label)).reduce((n, c) => n + c.count, 0);
  const rangeLink = (r: Range) => (
    <Link
      href={r === 30 ? "/admin" : `/admin?range=${r}`}
      className={`rounded-full px-3 py-1 text-xs ${range === r ? "bg-[var(--accent)] text-black" : "text-white/70 hover:bg-white/5"}`}
    >
      {r} days
    </Link>
  );

  const issues: Issue[] = [];
  if (!settings.phone)
    issues.push({
      label: "No phone number set",
      hint: "Adds Call and Text to the mobile quick menu and the careers page.",
      href: "/admin/settings",
      level: "warn",
    });
  if (!settings.address)
    issues.push({
      label: "No address set",
      hint: "The footer and contact page have nowhere to show where you are.",
      href: "/admin/settings",
      level: "warn",
    });
  if (noImage > 0)
    issues.push({
      label: `${noImage} published product${noImage === 1 ? "" : "s"} with no photo`,
      hint: "These show an empty tile in the shop.",
      href: "/admin/products",
      level: "warn",
    });
  if (heroCount < 3)
    issues.push({
      label: "Hero slideshow is thin",
      hint: "Three or more photos keeps the homepage from feeling static.",
      href: "/admin/galleries",
      level: "info",
    });
  if (newApps > 0)
    issues.push({
      label: `${newApps} job application${newApps === 1 ? "" : "s"} to review`,
      hint: "Submitted from the careers page.",
      href: "/admin/jobs",
      level: "info",
    });

  const { open, label } = computeOpen(hours);
  const today = hours.find((h) => h.day === nowLocal().day);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        action={
          <div className="flex overflow-hidden rounded-full border border-white/15">
            {rangeLink(7)}
            {rangeLink(30)}
          </div>
        }
      />

      {/* Store status up top: the one thing worth knowing at a glance. */}
      <Card className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${
            open
              ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
              : "border-white/15 bg-white/5 text-white/60"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${open ? "bg-[var(--accent)]" : "bg-white/40"}`} />
          {open ? "Open" : "Closed"}
          {label ? <span className="font-normal opacity-80">· {label}</span> : null}
        </span>
        <span className="text-sm text-white/60">
          {today
            ? `${DAYS[today.day]}: ${today.closed ? "Closed" : `${today.open} – ${today.close}`}`
            : "Hours not set"}
        </span>
        <Link href="/admin/staff" className="ml-auto text-sm text-[var(--accent)] hover:underline">
          Edit hours
        </Link>
      </Card>

      {/* Only surfaces when there is something to do. */}
      {openOrders > 0 ? (
        <Card className="mb-6 border-[var(--accent)]/40">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl">
                {openOrders} order{openOrders === 1 ? "" : "s"} waiting
              </h2>
              <p className="mt-1 text-sm text-white/60">
                {recentOrders.map((o) => o.customer || "Guest").join(", ")}
              </p>
            </div>
            <Link href="/admin/orders" className="btn-accent shrink-0 text-sm">
              View
            </Link>
          </div>
        </Card>
      ) : null}

      <h2 className="mb-3 text-[11px] font-bold tracking-widest text-white/50">NEEDS ATTENTION</h2>
      <SiteHealth issues={issues} />

      {/* ---- traffic ---- */}
      <h2 className="mb-3 mt-8 text-[11px] font-bold tracking-widest text-white/50">LAST {range} DAYS</h2>
      {hasData ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Stat
              label="PAGE VIEWS"
              value={a.total}
              index={0}
              sub={<Delta now={a.total} prev={a.prevTotal} />}
              chart={<Sparkline points={a.series.map((d) => d.views)} label={`Views per day, last ${range} days`} />}
            />
            <Stat label="VISITORS" value={a.uniques} index={1} sub={<span className="text-xs text-white/40">unique, {a.today} views today</span>} />
            <Stat label="CALL / DIRECTIONS TAPS" value={taps} index={2} sub={<span className="text-xs text-white/40">from buttons</span>} />
            <Stat label="SPINS" value={a.conversions.spins} index={3} sub={<span className="text-xs text-white/40">prizes claimed</span>} />
            <Stat label="VIP SIGNUPS" value={a.conversions.vip} index={4} accent={a.conversions.vip > 0} sub={<span className="text-xs text-white/40">emails collected</span>} />
          </div>

          <div className="card admin-rise mt-3 p-5" style={{ ["--i" as string]: 5 }}>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-semibold">Traffic</h3>
              <span className="text-xs text-white/45">page views per day</span>
            </div>
            <BarChart data={a.series.map((d) => ({ key: d.day, value: d.views, title: d.day }))} label={`Page views per day, last ${range} days`} />
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="card admin-rise p-5" style={{ ["--i" as string]: 6 }}>
              <h3 className="mb-3 font-semibold">Where they land</h3>
              <HBars label="Most viewed pages" rows={a.topPages.map((r) => ({ label: r.path === "/" ? "/ (home)" : r.path, value: r.views }))} />
            </div>
            <div className="card admin-rise p-5" style={{ ["--i" as string]: 7 }}>
              <h3 className="mb-3 font-semibold">What they tap</h3>
              <HBars label="Button clicks" rows={a.clicks.slice(0, 8).map((r) => ({ label: CLICK_LABELS[r.label] ?? r.label, value: r.count }))} empty="No button taps recorded yet" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="SPIN TO WIN" value={a.conversions.spins} index={8} href="/admin/coupons" />
            <Stat label="VIP SIGNUPS" value={a.conversions.vip} index={9} href="/admin/emails" />
            <Stat label="JOB APPLICATIONS" value={a.conversions.careers} index={10} href="/admin/jobs" />
            <Stat label="AI CHAT MESSAGES" value={a.conversions.chat} index={11} />
          </div>
        </>
      ) : (
        <div className="card p-6">
          <p className="font-display text-2xl">Collecting data</p>
          <p className="mt-1 max-w-prose text-sm text-white/60">
            The site now records page views, button taps, spins and signups (privately — no cookies, no IPs). Charts appear here after a day or so of visits.
            {a.totalEvents > 0 ? ` ${a.totalEvents} event${a.totalEvents === 1 ? "" : "s"} so far.` : ""}
          </p>
        </div>
      )}

      <h2 className="mb-3 mt-8 text-[11px] font-bold tracking-widest text-white/50">SHORTCUTS</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {QUICK_ACTIONS.map((a, i) => (
          <QuickAction key={a.href} {...a} index={i} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-[11px] font-bold tracking-widest text-white/50">AT A GLANCE</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="PRODUCTS" value={products} href="/admin/products" index={0} />
        <Stat label="BLOG POSTS" value={blog} href="/admin/blog" index={1} />
        <Stat label="COUPONS" value={coupons} href="/admin/coupons" index={2} />
        <Stat label="VIP MEMBERS" value={vip} href="/admin/emails" index={3} />
        <Stat label="OPEN ORDERS" value={openOrders} href="/admin/orders" accent={openOrders > 0} index={4} />
      </div>

      <div className="mt-8">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/50 hover:text-white"
        >
          ↗ View the live site
        </a>
      </div>
    </div>
  );
}
