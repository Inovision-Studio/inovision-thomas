import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, LinkButton } from "@/components/admin/ui";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Blog"
        sub={`${posts.length} posts`}
        action={<LinkButton href="/admin/blog/new">+ New post</LinkButton>}
      />

      <div className="card divide-y divide-white/5">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
              {p.image ? (
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-[10px] text-white/40">no img</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{p.title}</div>
              <div className="text-sm text-white/50">{p.publishedAt.toLocaleDateString()}</div>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${p.published ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-white/10 text-white/50"}`}>
              {p.published ? "LIVE" : "DRAFT"}
            </span>
            <Link href={`/admin/blog/${p.id}`} className="text-sm text-white/80 hover:underline">Edit</Link>
            <DeleteButton id={p.id} />
          </div>
        ))}
        {posts.length === 0 && <div className="p-8 text-center text-sm text-white/40">No posts yet.</div>}
      </div>
    </div>
  );
}
