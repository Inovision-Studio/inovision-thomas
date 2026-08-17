import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import MockupsClient from "./MockupsClient";

export const dynamic = "force-dynamic";

export default async function MockupsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const openId = Number(id);
  const [list, open] = await Promise.all([
    db.mockup.findMany({ select: { id: true, name: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 200 }),
    Number.isInteger(openId) ? db.mockup.findUnique({ where: { id: openId } }) : null,
  ]);
  return (
    <div>
      <PageHeader title="Mockups" sub="Raw HTML mockups with live preview — hand-written now, AI-generated later" />
      <MockupsClient
        list={list.map((m) => ({ ...m, updatedAt: m.updatedAt.toISOString() }))}
        open={open ? { id: open.id, name: open.name, html: open.html } : null}
      />
    </div>
  );
}
