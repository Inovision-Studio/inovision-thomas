import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import ClientDetailClient from "./ClientDetailClient";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  // Opening the thread counts as the team reading it.
  await db.clientMessage.updateMany({ where: { clientId: id, sender: "client", readByTeam: false }, data: { readByTeam: true } });
  const [c, session] = await Promise.all([
    db.client.findUnique({
      where: { id },
      include: {
        milestones: { orderBy: [{ sort: "asc" }, { createdAt: "asc" }] },
        messages: { orderBy: { createdAt: "asc" }, take: 500 },
        deployments: { orderBy: { ts: "desc" }, take: 200 },
        agreements: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" }, take: 200 },
      },
    }),
    getSession(),
  ]);
  if (!c) notFound();
  const iso = (d: Date | null) => d?.toISOString() ?? null;
  return (
    <div>
      <PageHeader
        title={c.name}
        sub={`${c.stage} · client since ${c.createdAt.toLocaleDateString()}`}
        action={<Link href="/admin/clients" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">← All clients</Link>}
      />
      <ClientDetailClient
        isOwner={session?.role === "owner"}
        client={{
          id: c.id, name: c.name, email: c.email, phone: c.phone, site: c.site, plan: c.plan, hosting: c.hosting, ai: c.ai, extra: c.extra,
          projectFee: c.projectFee, depositAmount: c.depositAmount, depositPaid: c.depositPaid, stage: c.stage, stageAt: iso(c.stageAt),
          brief: c.brief, notes: c.notes, launchedAt: iso(c.launchedAt), subActive: c.subActive, createdAt: c.createdAt.toISOString(),
        }}
        milestones={c.milestones.map((m) => ({ id: m.id, title: m.title, due: m.due, done: m.done }))}
        messages={c.messages.map((m) => ({ id: m.id, sender: m.sender, author: m.author, body: m.body, createdAt: m.createdAt.toISOString() }))}
        deployments={c.deployments.map((d) => ({ id: d.id, summary: d.summary, url: d.url, ts: d.ts.toISOString() }))}
        agreements={c.agreements.map((a) => ({ id: a.id, tosVersion: a.tosVersion, privacyVersion: a.privacyVersion, agreedTos: a.agreedTos, agreedPrivacy: a.agreedPrivacy, agreedArbitration: a.agreedArbitration, fullName: a.fullName, ip: a.ip, createdAt: a.createdAt.toISOString() }))}
        invoices={c.invoices.map((i) => ({ id: i.id, period: i.period, description: i.description, amount: i.amount, status: i.status, createdAt: i.createdAt.toISOString(), paidAt: iso(i.paidAt) }))}
      />
    </div>
  );
}
