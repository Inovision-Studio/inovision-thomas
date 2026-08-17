import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import InboxClient from "./InboxClient";

export const dynamic = "force-dynamic";

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const where = tab === "unread" ? { readAt: null } : {};
  const [messages, unread] = await Promise.all([
    db.message.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    db.message.count({ where: { readAt: null } }),
  ]);
  return (
    <div>
      <PageHeader title="Inbox" sub={`${unread} unread · contact-form messages from the website`} />
      <InboxClient messages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString(), readAt: m.readAt?.toISOString() ?? null }))} tab={tab === "unread" ? "unread" : "all"} />
    </div>
  );
}
