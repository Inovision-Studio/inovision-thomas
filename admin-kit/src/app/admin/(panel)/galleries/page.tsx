import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import GalleriesClient from "./GalleriesClient";

export const dynamic = "force-dynamic";

const SECTIONS: Array<{ key: string; title: string }> = [
  { key: "hero", title: "Hero" },
  { key: "coverflow", title: "Coverflow" },
  { key: "marquee", title: "Marquee" },
];

export default async function GalleriesPage() {
  // Ensure the three galleries exist so images can always be attached.
  await Promise.all(
    SECTIONS.map((s) =>
      db.gallery.upsert({ where: { key: s.key }, update: {}, create: { key: s.key, title: s.title } }),
    ),
  );

  const galleries = await db.gallery.findMany({
    where: { key: { in: SECTIONS.map((s) => s.key) } },
    include: { images: { orderBy: { sort: "asc" } } },
  });

  const ordered = SECTIONS.map((s) => galleries.find((g) => g.key === s.key)!).map((g) => ({
    id: g.id,
    key: g.key,
    title: g.title,
    images: g.images.map((i) => ({ id: i.id, imageRef: i.imageRef })),
  }));

  return (
    <div>
      <PageHeader title="Galleries" sub="Manage the hero, coverflow, and marquee image sets." />
      <GalleriesClient galleries={ordered} />
    </div>
  );
}
