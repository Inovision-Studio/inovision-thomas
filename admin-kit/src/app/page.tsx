import { Fragment } from "react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { getSession } from "@/lib/auth";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import EditBridge from "@/components/public/EditBridge";
import { directionsTarget } from "@/lib/locations";
import { editAttrs, sectionAttrs, layoutAttrs } from "@/lib/editAttrs";
import { parseLayout } from "@/lib/homeLayout";
import { HOME_SECTIONS, type HomeCtx } from "@/components/home/sections";

export const dynamic = "force-dynamic";

async function gallery(key: string) {
  const g = await db.gallery
    .findUnique({ where: { key }, include: { images: { orderBy: { sort: "asc" } } } })
    .catch(() => null);
  return g?.images.map((i) => i.imageRef) ?? [];
}

export default async function Home({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const sp = await searchParams;
  // Edit affordances only for the owner, only when explicitly asked for — a
  // visitor with ?edit=1 gets the exact same HTML as everyone else.
  const isEditing = sp.edit === "1" && (await getSession())?.role === "owner";

  const [s, hero, coverflow, marqueeGallery, marqueeProducts, products, posts, reviews, categoryRows] = await Promise.all([
    getSettings().catch(() => ({}) as Record<string, string>),
    gallery("hero"),
    gallery("coverflow"),
    gallery("marquee"),
    db.product
      .findMany({ where: { published: true }, orderBy: { sort: "asc" }, select: { images: true }, take: 40 })
      .catch(() => []),
    db.product.findMany({ where: { published: true }, orderBy: { sort: "asc" }, take: 8 }).catch(() => []),
    db.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }).catch(() => []),
    db.review.findMany({ orderBy: { sort: "asc" }, take: 6 }).catch(() => []),
    db.product
      .groupBy({ by: ["category"], where: { published: true }, _count: true })
      .catch(() => [] as { category: string; _count: number }[]),
  ]);

  // marquee is admin-managed (Admin → Galleries → Product Marquee);
  // falls back to product photos if the gallery is emptied
  const productPhotos = [...new Set(marqueeProducts.map((p) => p.images[0]).filter(Boolean))];
  const marquee = (marqueeGallery.length > 0 ? marqueeGallery : productPhotos).slice(0, 24);

  const categories = [...categoryRows]
    .sort((a, b) => b._count - a._count)
    .map((c) => ({ name: c.category, count: c._count }));

  const layout = parseLayout(s.home_layout);

  const ctx: HomeCtx = {
    s,
    layout,
    isEditing,
    e: editAttrs(isEditing),
    sec: sectionAttrs(isEditing),
    lay: layoutAttrs(isEditing),
    hero,
    coverflow,
    marquee,
    products,
    posts,
    reviews,
    categories,
    mapsUrl: await directionsTarget(s),
    phone: s.phone || "",
  };

  // Visitors get exactly the visible sections. In edit mode hidden sections still
  // render (with the `hidden` attribute) so un-hiding previews live in the iframe.
  const ids = isEditing ? layout.order : layout.order.filter((id) => !layout.hidden.includes(id));

  const body = ids.map((id) => {
    const node = HOME_SECTIONS[id](ctx);
    if (!node) return null;
    if (isEditing && layout.hidden.includes(id)) {
      return (
        <div key={id} hidden data-section-hidden={id}>
          {node}
        </div>
      );
    }
    return <Fragment key={id}>{node}</Fragment>;
  });

  return (
    <>
      <Nav />
      {isEditing ? <div data-edit-root="">{body}</div> : body}
      {isEditing ? <EditBridge /> : null}
      <Footer />
    </>
  );
}
