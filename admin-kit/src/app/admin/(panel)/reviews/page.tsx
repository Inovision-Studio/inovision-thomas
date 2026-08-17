import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import ReviewsClient from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await db.review.findMany({ orderBy: [{ sort: "asc" }, { id: "asc" }] });
  return (
    <div>
      <PageHeader title="Reviews" sub="Customer reviews shown on the public home page." />
      <ReviewsClient reviews={reviews} />
    </div>
  );
}
