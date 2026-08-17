import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { FEEDS } from "@/app/api/admin/news/feeds";
import NewsClient from "./NewsClient";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await db.news.findMany({ orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { id: "desc" }] });
  return (
    <div>
      <PageHeader title="News feed" sub={`${news.length} items · industry headlines pulled from ${FEEDS.length} RSS feeds`} />
      <NewsClient
        news={news.map((n) => ({ ...n, publishedAt: n.publishedAt?.toISOString() ?? null, fetchedAt: n.fetchedAt.toISOString() }))}
        feeds={FEEDS}
      />
    </div>
  );
}
