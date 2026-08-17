import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import JobsClient, { type JobRow } from "./JobsClient";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const rows = await db.jobApplication
    .findMany({ orderBy: [{ archived: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);

  const active = rows.filter((r) => !r.archived).length;

  return (
    <div>
      <PageHeader
        title="Job Applications"
        sub={active > 0 ? `${active} awaiting review` : "Submitted from the Careers page"}
      />
      <JobsClient rows={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })) as JobRow[]} />
    </div>
  );
}
