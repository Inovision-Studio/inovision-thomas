import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import { formatPrice } from "@/components/public/util";
import ReserveForm from "@/components/public/ReserveForm";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, s] = await Promise.all([
    db.product.findUnique({ where: { slug } }).catch(() => null),
    getSettings().catch(() => ({}) as Record<string, string>),
  ]);
  if (!product || !product.published) notFound();

  const phone = s.phone || "";

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Link href="/shop" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--text)]">
          ← Back to shop
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            {product.images.length > 0 ? (
              product.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt={product.name} className="card w-full object-cover" />
              ))
            ) : (
              <div className="card flex aspect-square items-center justify-center text-[color:var(--muted)]">No image</div>
            )}
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-[color:var(--muted)]">{product.category}</span>
            <h1 className="mt-1 font-display text-5xl leading-tight">{product.name}</h1>
            <p className="mt-3 font-display text-4xl text-[color:var(--accent)]">
              {formatPrice(product.priceMin, product.priceMax)}
            </p>
            {product.description ? (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-[color:var(--muted)]">{product.description}</p>
            ) : null}
            <ReserveForm slug={product.slug} name={product.name} phone={phone} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
