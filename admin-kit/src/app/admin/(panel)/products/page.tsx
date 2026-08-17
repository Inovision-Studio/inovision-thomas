import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, LinkButton } from "@/components/admin/ui";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Accessories", "Mushrooms", "Detox", "Glass", "Candles", "Lighters"];

function price(min: number, max: number | null) {
  const f = (n: number) => `$${n.toFixed(2)}`;
  return max != null && max !== min ? `${f(min)}–${f(max)}` : f(min);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category && CATEGORIES.includes(category) ? category : undefined;
  const products = await db.product.findMany({
    where: active ? { category: active } : undefined,
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
  });

  const tab = (label: string, href: string, on: boolean) => (
    <Link
      key={label}
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm ${on ? "bg-[var(--accent)] text-black" : "border border-white/15 text-white/70 hover:bg-white/5"}`}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <PageHeader
        title="Products"
        sub={`${products.length} shown`}
        action={<LinkButton href="/admin/products/new">+ New product</LinkButton>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {tab("All", "/admin/products", !active)}
        {CATEGORIES.map((c) => tab(c, `/admin/products?category=${c}`, active === c))}
      </div>

      <div className="card divide-y divide-white/5">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
              {p.images[0] ? (
                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-[10px] text-white/40">no img</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{p.name}</div>
              <div className="text-sm text-white/50">{p.category} · {price(p.priceMin, p.priceMax)}</div>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${p.published ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-white/10 text-white/50"}`}>
              {p.published ? "LIVE" : "DRAFT"}
            </span>
            <Link href={`/admin/products/${p.id}`} className="text-sm text-white/80 hover:underline">Edit</Link>
            <DeleteButton id={p.id} />
          </div>
        ))}
        {products.length === 0 && <div className="p-8 text-center text-sm text-white/40">No products yet.</div>}
      </div>
    </div>
  );
}
