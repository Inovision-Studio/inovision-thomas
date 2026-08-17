"use client";

import { useState } from "react";
import ImagePicker from "@/components/admin/ImagePicker";
import { inputClass } from "@/components/admin/ui";
import { createProduct, updateProduct } from "./actions";

const CATEGORIES = ["Accessories", "Mushrooms", "Detox", "Glass", "Candles", "Lighters"];

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export type ProductInit = {
  id: number;
  name: string;
  slug: string;
  category: string;
  priceMin: number;
  priceMax: number | null;
  description: string;
  images: string[];
  published: boolean;
  sort: number;
};

export default function ProductForm({ init }: { init?: ProductInit }) {
  const [name, setName] = useState(init?.name ?? "");
  const [slug, setSlug] = useState(init?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!init);
  const [images, setImages] = useState<string[]>(init?.images ?? []);

  const action = init
    ? updateProduct.bind(null, init.id)
    : createProduct;

  return (
    <form action={action} className="card max-w-2xl space-y-5 p-6">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div>
        <label className="mb-1 block text-sm text-white/80">Name</label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/80">Slug</label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugEdited(true);
          }}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/80">Category</label>
        <select name="category" defaultValue={init?.category ?? "Accessories"} className={inputClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-white/80">Price min</label>
          <input name="priceMin" type="number" step="0.01" required defaultValue={init?.priceMin ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Price max (optional)</label>
          <input name="priceMax" type="number" step="0.01" defaultValue={init?.priceMax ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/80">Description</label>
        <textarea name="description" rows={5} defaultValue={init?.description ?? ""} className={inputClass} />
      </div>

      <div>
        <div className="mb-2 text-sm text-white/80">Images</div>
        <div className="space-y-3">
          {images.map((ref, i) => (
            <div key={ref + i} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-2">
              <img src={ref} alt="" className="h-14 w-14 rounded object-cover" />
              <code className="flex-1 truncate text-xs text-white/50">{ref}</code>
              <button
                type="button"
                onClick={() => setImages((l) => l.filter((_, idx) => idx !== i))}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/5"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <ImagePicker label="Add image" onChange={(ref) => setImages((l) => [...l, ref])} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/80">Sort</label>
        <input name="sort" type="number" defaultValue={init?.sort ?? 0} className={inputClass} />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input name="published" type="checkbox" defaultChecked={init ? init.published : true} />
        Published
      </label>

      <button type="submit" className="btn-accent">{init ? "Save changes" : "Create product"}</button>
    </form>
  );
}
