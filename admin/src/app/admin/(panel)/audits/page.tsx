import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import AuditsClient from "./AuditsClient";

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const audits = await db.audit.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { items: { select: { done: true } } } });
  const open = audits.filter((a) => a.status === "in_progress").length;
  return (
    <div>
      <PageHeader title="Audits" sub={`${open} in progress · website audits you deliver to prospects`} />
      <AuditsClient
        audits={audits.map((a) => ({
          id: a.id, company: a.company, contact: a.contact, email: a.email, status: a.status,
          total: a.items.length, done: a.items.filter((i) => i.done).length, createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
