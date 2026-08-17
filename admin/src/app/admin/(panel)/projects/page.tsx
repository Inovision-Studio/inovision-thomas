import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const selectedId = Number(id);
  const [projects, selected] = await Promise.all([
    db.project.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { updates: true } } } }),
    Number.isInteger(selectedId)
      ? db.project.findUnique({ where: { id: selectedId }, include: { updates: { orderBy: { createdAt: "desc" } } } })
      : null,
  ]);
  const active = projects.filter((p) => p.status === "Active").length;
  return (
    <div>
      <PageHeader title="Projects" sub={`${active} active · ${projects.length} total`} />
      <ProjectsClient
        projects={projects.map((p) => ({ id: p.id, name: p.name, status: p.status, updates: p._count.updates, createdAt: p.createdAt.toISOString() }))}
        selected={selected ? { id: selected.id, name: selected.name, status: selected.status, updates: selected.updates.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })) } : null}
      />
    </div>
  );
}
