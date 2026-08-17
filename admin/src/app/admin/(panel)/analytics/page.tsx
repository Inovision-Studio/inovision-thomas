import Link from "next/link";
import { summary, CLICK_LABELS, type Range } from "@/lib/analytics";
import { PageHeader, Card, Stat } from "@/components/admin/ui";
import { BarChart, HBars, Sparkline, Delta } from "@/components/admin/charts";
import CopySnippet from "./CopySnippet";

export const dynamic = "force-dynamic";

const SNIPPET = `<script>
  var t = function (kind, label) { navigator.sendBeacon("https://YOUR-ADMIN-HOST/api/track", JSON.stringify({ kind: kind, path: location.pathname, label: label || "", ref: document.referrer })); };
  t("pageview");
  document.addEventListener("click", function (e) { var el = e.target.closest("[data-track]"); if (el) t("click", el.getAttribute("data-track")); });
</script>`;

const fmt = (n: number) => n.toLocaleString("en-US");

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range: r } = await searchParams;
  const range: Range = r === "7" ? 7 : 30;
  const a = await summary(range);
  const conv = [
    { label: "Spins", value: a.conversions.spins },
    { label: "VIP signups", value: a.conversions.vip },
    { label: "Career applications", value: a.conversions.careers },
    { label: "Chats", value: a.conversions.chat },
  ].filter((c) => c.value > 0);

  const toggle = (
    <div className="flex gap-2">
      {([7, 30] as const).map((n) => (
        <Link key={n} href={`/admin/analytics?range=${n}`} className={`rounded-full px-3 py-1 text-sm ${range === n ? "bg-[var(--accent)] text-black" : "text-white/60 hover:bg-white/5"}`}>
          {n}d
        </Link>
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader title="Analytics" sub={`Site traffic · last ${range} days · ${fmt(a.totalEvents)} events recorded`} action={toggle} />

      {a.totalEvents < 20 ? (
        <Card className="mb-6">
          <h2 className="font-display text-xl">Collecting data</h2>
          <p className="mt-1 text-sm text-white/60">
            Charts appear after ~20 events. The public site sends beacons to <code className="text-white/80">POST /api/track</code> as JSON: <code className="text-white/80">{`{ kind: "pageview" | "click", path, label }`}</code>. Click labels must look like <code className="text-white/80">cta:start</code> (lowercase <code className="text-white/80">group:name</code>). Drop this into the Astro site&apos;s base layout and replace the host:
          </p>
          <div className="mt-3">
            <CopySnippet code={SNIPPET} />
          </div>
          <p className="mt-3 text-xs text-white/40">Then add <code>data-track=&quot;cta:start&quot;</code> (or cta:contact, cta:call, cta:pricing, cta:portal) to the buttons you care about.</p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Pageviews" value={a.total} index={0} accent sub={<Delta now={a.total} prev={a.prevTotal} />} chart={<Sparkline points={a.series.map((d) => d.views)} label="Pageviews per day" />} />
        <Stat label="Unique visitors" value={a.uniques} index={1} sub={<span className="text-xs text-white/40">rotating daily hash, no cookies</span>} />
        <Stat label="Today" value={a.today} index={2} sub={<span className="text-xs text-white/40">pageviews since midnight</span>} />
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 font-display text-xl">Pageviews per day</h2>
        <BarChart data={a.series.map((d) => ({ key: d.day, value: d.views, title: d.day }))} label={`Pageviews per day, last ${range} days`} />
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-xl">Top pages</h2>
          <HBars rows={a.topPages.map((p) => ({ label: p.path, value: p.views }))} label="Top pages" empty="No pageviews yet." />
        </Card>
        <Card>
          <h2 className="mb-3 font-display text-xl">Clicks</h2>
          <HBars rows={a.clicks.map((c) => ({ label: CLICK_LABELS[c.label] ?? (c.label === "product:any" ? "Product cards" : c.label), value: c.count }))} label="Clicks by label" empty="No clicks yet. Add data-track attributes to buttons on the public site." />
        </Card>
      </div>

      {conv.length > 0 ? (
        <>
          <h2 className="mb-3 mt-8 font-display text-xl">Conversions</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {conv.map((c, i) => (
              <Stat key={c.label} label={c.label} value={c.value} index={i} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
