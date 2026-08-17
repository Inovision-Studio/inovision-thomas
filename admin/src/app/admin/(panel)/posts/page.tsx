import { db } from "@/lib/db";
import { PageHeader, LinkButton } from "@/components/admin/ui";
import PostsClient from "./PostsClient";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await db.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, slug: true, template: true, published: true, views: true, updatedAt: true },
  });
  const live = posts.filter((p) => p.published).length;
  return (
    <div>
      <PageHeader title="Posts" sub={`${posts.length} posts · ${live} published`} action={<LinkButton href="/admin/posts/new">New post</LinkButton>} />
      <PostsClient posts={posts.map((p) => ({ ...p, updatedAt: p.updatedAt.toISOString() }))} />
    </div>
  );
}
