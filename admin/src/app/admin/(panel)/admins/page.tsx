import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MODULES, OWNER_ONLY } from "@/lib/modules";
import { PageHeader } from "@/components/admin/ui";
import AdminsClient from "./AdminsClient";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const session = await getSession();
  if (!session || session.role !== "owner") redirect("/admin");
  const admins = await db.admin.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }], omit: { passwordHash: true } });
  const grantable = MODULES.filter((m) => m.key !== "dashboard" && !OWNER_ONLY.has(m.key)).map(({ key, label }) => ({ key, label }));
  return (
    <div>
      <PageHeader title="Admins" sub={`${admins.length} account${admins.length === 1 ? "" : "s"} · owners see everything, staff see only the modules you grant`} />
      <AdminsClient
        me={session.adminId}
        grantable={grantable}
        admins={admins.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
      />
    </div>
  );
}
