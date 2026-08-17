import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import ApplicationsClient from "./ApplicationsClient";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const where = tab === "unread" ? { readAt: null } : {};
  const [apps, unread] = await Promise.all([
    db.application.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    db.application.count({ where: { readAt: null } }),
  ]);
  return (
    <div>
      <PageHeader title="Applications" sub={`${unread} unread · job applications from the website`} />
      <ApplicationsClient
        apps={apps.map((a) => ({ ...a, createdAt: a.createdAt.toISOString(), readAt: a.readAt?.toISOString() ?? null }))}
        tab={tab === "unread" ? "unread" : "all"}
      />
    </div>
  );
}
