import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id: Number(id) } });
  if (!post) notFound();

  return (
    <div>
      <PageHeader title="Edit post" sub={post.title} />
      <PostForm init={post} />
    </div>
  );
}
