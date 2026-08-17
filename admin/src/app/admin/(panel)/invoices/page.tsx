import { db } from "@/lib/db";
import { PageHeader, Stat } from "@/components/admin/ui";
import InvoicesClient from "./InvoicesClient";

export const dynamic = "force-dynamic";

const OVERDUE_DAYS = 30;
const usd = (n: number) => `$${n.toFixed(2)}`;

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ status?: string; client?: string }> }) {
  const sp = await searchParams;
  const status = sp.status === "paid" || sp.status === "unpaid" ? sp.status : "all";
  const clientId = Number(sp.client);
  const where = { ...(status !== "all" ? { status } : {}), ...(Number.isInteger(clientId) && clientId > 0 ? { clientId } : {}) };
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const overdueBefore = new Date(now.getTime() - OVERDUE_DAYS * 86400e3);

  const [invoices, clients, unpaid, paidMonth, overdue] = await Promise.all([
    db.invoice.findMany({ where, orderBy: { createdAt: "desc" }, take: 300, include: { client: { select: { name: true } } } }),
    db.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, email: true } }),
    db.invoice.aggregate({ _sum: { amount: true }, where: { status: "unpaid" } }),
    db.invoice.aggregate({ _sum: { amount: true }, where: { status: "paid", paidAt: { gte: monthStart } } }),
    db.invoice.count({ where: { status: "unpaid", createdAt: { lt: overdueBefore } } }),
  ]);

  return (
    <div>
      <PageHeader title="Invoices" sub="Bill clients, track what's paid, chase what's overdue" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="UNPAID TOTAL" value={usd(unpaid._sum.amount ?? 0)} href="/admin/invoices?status=unpaid" accent index={0} />
        <Stat label="PAID THIS MONTH" value={usd(paidMonth._sum.amount ?? 0)} href="/admin/invoices?status=paid" index={1} />
        <Stat label="OVERDUE" value={overdue} sub={<span className="text-xs text-white/50">unpaid &gt; {OVERDUE_DAYS} days</span>} href="/admin/invoices?status=unpaid" index={2} />
      </div>
      <InvoicesClient
        status={status}
        clientFilter={Number.isInteger(clientId) && clientId > 0 ? clientId : null}
        clients={clients}
        invoices={invoices.map((i) => ({
          id: i.id,
          clientId: i.clientId,
          clientName: i.client.name,
          period: i.period,
          description: i.description,
          recipient: i.recipient,
          amount: i.amount,
          status: i.status,
          payUrl: i.payUrl,
          createdAt: i.createdAt.toISOString(),
          paidAt: i.paidAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
