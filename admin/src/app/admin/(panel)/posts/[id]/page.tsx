import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { getSetting } from "@/lib/settings";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [post, siteUrl] = await Promise.all([db.post.findUnique({ where: { id } }), getSetting("site_url")]);
  if (!post) notFound();
  return (
    <div>
      <PageHeader title="Edit post" sub={`${post.views} views · updated ${post.updatedAt.toLocaleDateString()}`} />
      <PostForm siteUrl={siteUrl} post={{ id: post.id, title: post.title, slug: post.slug, subtitle: post.subtitle, body: post.body, template: post.template, images: post.images, published: post.published }} />
    </div>
  );
}
