import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await db.galleryItem.findMany({ orderBy: [{ sort: "asc" }, { id: "asc" }] });
  return (
    <div>
      <PageHeader title="Work gallery" sub={`${items.length} image${items.length === 1 ? "" : "s"} · shown on the public work page, in this order`} />
      <GalleryClient items={items.map((i) => ({ id: i.id, url: i.url, title: i.title, category: i.category, sort: i.sort }))} />
    </div>
  );
}
