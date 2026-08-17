"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/admin/ui";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type PostRow = { id: number; title: string; slug: string; template: string; published: boolean; views: number; updatedAt: string };

export default function PostsClient({ posts }: { posts: PostRow[] }) {
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();

  async function act(action: "delete" | "togglePublished", p: PostRow) {
    if (action === "delete" && !(await confirm({ title: `Delete “${p.title}”?`, body: "This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    const r = await fetch("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, id: p.id }) });
    if (!r.ok) return toast("Something went wrong", "error");
    toast(action === "delete" ? "Deleted" : p.published ? "Unpublished" : "Published");
    router.refresh();
  }

  return (
    <Card>
      {posts.length === 0 ? (
        <p className="py-8 text-center text-white/40">No posts yet. Click “New post” to write your first article for the blog.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/50">
              <tr>
                <th className="py-2 pr-3 font-normal">Title</th>
                <th className="py-2 pr-3 font-normal">Slug</th>
                <th className="py-2 pr-3 font-normal">Template</th>
                <th className="py-2 pr-3 font-normal">Status</th>
                <th className="py-2 pr-3 font-normal text-right">Views</th>
                <th className="py-2 pr-3 font-normal">Updated</th>
                <th className="py-2 pr-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="py-2 pr-3"><Link href={`/admin/posts/${p.id}`} className="font-medium hover:text-[var(--accent)]">{p.title}</Link></td>
                  <td className="py-2 pr-3 font-mono text-xs text-white/60">{p.slug}</td>
                  <td className="py-2 pr-3 capitalize text-white/70">{p.template}</td>
                  <td className="py-2 pr-3">
                    <button onClick={() => act("togglePublished", p)} title="Toggle published" className={`rounded-full px-2.5 py-0.5 text-xs ${p.published ? "bg-[var(--accent)] text-black" : "border border-white/20 text-white/60 hover:bg-white/5"}`}>
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{p.views}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-white/60">{new Date(p.updatedAt).toLocaleDateString()}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-right">
                    <Link href={`/admin/posts/${p.id}`} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5">Edit</Link>
                    <button onClick={() => act("delete", p)} className="ml-2 rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/10">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
