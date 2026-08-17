import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import AuditDetailClient from "./AuditDetailClient";

export const dynamic = "force-dynamic";

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const a = await db.audit.findUnique({ where: { id }, include: { items: { orderBy: { createdAt: "asc" } } } });
  if (!a) notFound();
  return (
    <div>
      <PageHeader
        title={a.company}
        sub={`Audit #${a.id} · created ${a.createdAt.toLocaleDateString()}`}
        action={<Link href="/admin/audits" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">← All audits</Link>}
      />
      <AuditDetailClient
        audit={{ id: a.id, company: a.company, contact: a.contact, email: a.email, status: a.status, summary: a.summary, createdAt: a.createdAt.toISOString() }}
        items={a.items.map((i) => ({ id: i.id, area: i.area, finding: i.finding, recommendation: i.recommendation, impact: i.impact, effort: i.effort, done: i.done }))}
      />
    </div>
  );
}
