import Link from "next/link";
import { formatPrice } from "./util";
import { sized, srcSet } from "@/lib/img";
import Tilt from "./Tilt";

export type ProductCardData = {
  slug: string;
  name: string;
  category: string;
  priceMin: number;
  priceMax: number | null;
  images: string[];
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const img = product.images[0];
  return (
    <Tilt className="h-full">
    <Link
      href={`/shop/${product.slug}`}
      data-track={`product:${product.slug}`}
      className="card group flex h-full flex-col overflow-hidden active:scale-[0.98]"
    >
      <div className="aspect-square overflow-hidden bg-black/30">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sized(img, 400)}
            srcSet={srcSet(img, 800)}
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[color:var(--muted)]">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs uppercase tracking-wide text-[color:var(--muted)]">{product.category}</span>
        <span className="line-clamp-2 font-medium leading-snug">{product.name}</span>
        <span className="mt-auto pt-2 font-display text-xl text-[color:var(--accent)]">
          {formatPrice(product.priceMin, product.priceMax)}
        </span>
      </div>
    </Link>
    </Tilt>
  );
}
