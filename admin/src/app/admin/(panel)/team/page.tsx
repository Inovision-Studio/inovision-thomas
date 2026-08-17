import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const members = await db.teamMember.findMany({ orderBy: [{ sort: "asc" }, { id: "asc" }] });
  return (
    <div>
      <PageHeader title="Team page" sub={`${members.length} member${members.length === 1 ? "" : "s"} · shown on the public team page in this order`} />
      <TeamClient members={members.map(({ id, name, title, image, sort }) => ({ id, name, title, image, sort }))} />
    </div>
  );
}
