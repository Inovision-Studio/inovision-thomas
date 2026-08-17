import { PageHeader } from "@/components/admin/ui";
import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader title="New post" />
      <PostForm />
    </div>
  );
}
