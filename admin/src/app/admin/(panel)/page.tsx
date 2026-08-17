import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, Stat, QuickAction, Card } from "@/components/admin/ui";
import { summary, type Range } from "@/lib/analytics";
import { Sparkline, BarChart, Delta } from "@/components/admin/charts";
import { getSession } from "@/lib/auth";
import { MODULES, canSee } from "@/lib/modules";

export const dynamic = "force-dynamic";

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const range: Range = sp.range === "7" ? 7 : 30;
  const session = await getSession();
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const [unread, newApps, clients, activeClients, unpaid, incomeMonth, expenseMonth, posts, recentMessages, dueMilestones, a] = await Promise.all([
    db.message.count({ where: { readAt: null } }).catch(() => 0),
    db.application.count({ where: { readAt: null } }).catch(() => 0),
    db.client.count().catch(() => 0),
    db.client.count({ where: { stage: { notIn: ["churned", "done"] } } }).catch(() => 0),
    db.invoice.aggregate({ _sum: { amount: true }, _count: true, where: { status: "unpaid" } }).catch(() => ({ _sum: { amount: 0 }, _count: 0 })),
    db.ledger.aggregate({ _sum: { amount: true }, where: { kind: "income", ts: { gte: monthStart } } }).catch(() => ({ _sum: { amount: 0 } })),
    db.ledger.aggregate({ _sum: { amount: true }, where: { kind: "expense", ts: { gte: monthStart } } }).catch(() => ({ _sum: { amount: 0 } })),
    db.post.count({ where: { published: true } }).catch(() => 0),
    db.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
    db.milestone.findMany({ where: { done: false }, orderBy: { createdAt: "asc" }, take: 5, include: { client: { select: { name: true, id: true } } } }).catch(() => []),
    summary(range).catch(() => null),
  ]);
  const income = incomeMonth._sum.amount ?? 0, expense = expenseMonth._sum.amount ?? 0;
  const quick = MODULES.filter((m) => m.key !== "dashboard" && canSee(session?.role ?? "staff", session?.permissions ?? [], m.key)).slice(0, 6);
  const isOwner = session?.role === "owner";

  return (
    <div>
      <PageHeader title={`Hey ${session?.name?.split(" ")[0] || "there"}`} sub="Everything that needs eyes today." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Unread messages" value={unread} href="/admin/inbox" accent={unread > 0} index={0} />
        <Stat label="New applications" value={newApps} href="/admin/applications" accent={newApps > 0} index={1} />
        <Stat label="Active clients" value={activeClients} href="/admin/clients" sub={`${clients} total`} index={2} />
        {isOwner ? <Stat label="Unpaid invoices" value={money(unpaid._sum.amount ?? 0)} href="/admin/invoices" sub={`${unpaid._count} open`} accent={unpaid._count > 0} index={3} /> : <Stat label="Published posts" value={posts} href="/admin/posts" index={3} />}
      </div>

      {isOwner ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Stat label="Income this month" value={money(income)} href="/admin/ledger" index={4} />
          <Stat label="Expenses this month" value={money(expense)} href="/admin/ledger" index={5} />
          <Stat label="Net" value={money(income - expense)} accent index={6} />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Latest messages</h2>
            <Link href="/admin/inbox" className="text-sm text-[var(--accent)]">Open inbox →</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="py-6 text-center text-white/40">Nothing yet. Contact-form messages from the site land here.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {recentMessages.map((m) => (
                <li key={m.id} className="py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    {!m.readAt ? <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-label="unread" /> : null}
                    <span className="font-medium">{m.name}</span>
                    <span className="text-white/45">{m.email}</span>
                    <span className="ml-auto text-xs text-white/40">{m.createdAt.toLocaleDateString()}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-white/60">{m.subject || m.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Open milestones</h2>
            <Link href="/admin/clients" className="text-sm text-[var(--accent)]">Clients →</Link>
          </div>
          {dueMilestones.length === 0 ? (
            <p className="py-6 text-center text-white/40">No open milestones. Add them on a client's page.</p>
          ) : (
            <ul className="divide-y divide-white/10 text-sm">
              {dueMilestones.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  <span className="font-medium">{m.title}</span>
                  <Link href={`/admin/clients/${m.client.id}`} className="text-white/50 hover:text-white">{m.client.name}</Link>
                  <span className="ml-auto text-xs text-white/40">{m.due || "no date"}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {a && a.totalEvents >= 20 ? (
        <Card className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Site traffic · last {range} days</h2>
            <div className="flex items-center gap-3 text-sm">
              <Delta now={a.total} prev={a.prevTotal} />
              <Link href="/admin?range=7" className={range === 7 ? "text-[var(--accent)]" : "text-white/50"}>7d</Link>
              <Link href="/admin?range=30" className={range === 30 ? "text-[var(--accent)]" : "text-white/50"}>30d</Link>
            </div>
          </div>
          <BarChart data={a.series.map((d) => ({ key: d.day, value: d.views, title: d.day }))} label="Pageviews per day" />
        </Card>
      ) : (
        <Card className="mt-6">
          <h2 className="font-display text-xl">Site traffic</h2>
          <p className="mt-1 text-sm text-white/50">Collecting data — the public site sends pageviews to <code className="text-white/70">/api/track</code>. Charts appear after ~20 events.{a ? <> <Sparkline points={a.series.map((d) => d.views)} label="views" /></> : null}</p>
        </Card>
      )}

      <h2 className="mb-3 mt-8 font-display text-xl">Jump to</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quick.map((m, i) => (
          <QuickAction key={m.key} href={m.href} label={m.label} index={i} />
        ))}
      </div>
    </div>
  );
}
