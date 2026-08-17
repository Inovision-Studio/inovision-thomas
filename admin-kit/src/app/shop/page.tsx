import Link from "next/link";
import { db } from "@/lib/db";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import ProductCard from "@/components/public/ProductCard";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const products = await db.product
    .findMany({ where: { published: true }, orderBy: [{ sort: "asc" }, { name: "asc" }] })
    .catch(() => []);

  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const tabs = [
    { key: "All", label: "All", count: products.length },
    ...[...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([key, count]) => ({ key, label: key, count })),
  ];

  const active = cat && counts.has(cat) ? cat : "All";
  const shown = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="font-display text-lg text-[color:var(--accent)]">Under one roof</p>
        <h1 className="font-display text-6xl">Shop the catalog</h1>
        <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
          Reserve any in-stock item online, then pay in store at pickup. No online payment needed.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const isActive = t.key === active;
            const href = t.key === "All" ? "/shop" : `/shop?cat=${encodeURIComponent(t.key)}`;
            return (
              <Link
                key={t.key}
                href={href}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent)]"
                    : "border-white/15 text-[color:var(--muted)] hover:text-[color:var(--text)]"
                }`}
              >
                {t.label} <span className="opacity-60">({t.count})</span>
              </Link>
            );
          })}
        </div>

        {shown.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-[color:var(--muted)]">No products in this category yet.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
