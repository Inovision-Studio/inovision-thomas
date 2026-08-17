import { PageHeader } from "@/components/admin/ui";
import { getSetting } from "@/lib/settings";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const siteUrl = await getSetting("site_url");
  return (
    <div>
      <PageHeader title="New post" sub="Write in Markdown; the first image is the cover." />
      <PostForm siteUrl={siteUrl} post={{ title: "", slug: "", subtitle: "", body: "", template: "editorial", images: [], published: false }} />
    </div>
  );
}
