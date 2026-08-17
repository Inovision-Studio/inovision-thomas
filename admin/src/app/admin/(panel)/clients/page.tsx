import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import ClientsClient from "./ClientsClient";
import { STAGES } from "./stages";

export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  const { stage } = await searchParams;
  const active = (STAGES as readonly string[]).includes(stage ?? "") ? stage! : "";
  const [clients, total] = await Promise.all([
    db.client.findMany({ where: active ? { stage: active } : {}, orderBy: { createdAt: "desc" }, take: 500 }),
    db.client.count(),
  ]);
  return (
    <div>
      <PageHeader title="Clients" sub={`${total} clients · agency accounts and portal users`} />
      <ClientsClient
        stage={active}
        clients={clients.map((c) => ({ id: c.id, name: c.name, email: c.email, phone: c.phone, plan: c.plan, stage: c.stage, projectFee: c.projectFee, depositPaid: c.depositPaid, createdAt: c.createdAt.toISOString() }))}
      />
    </div>
  );
}
