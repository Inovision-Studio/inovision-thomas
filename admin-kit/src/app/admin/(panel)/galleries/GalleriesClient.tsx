"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/admin/ui";
import ImagePicker from "@/components/admin/ImagePicker";

type Img = { id: number; imageRef: string };
type Gallery = { id: number; key: string; title: string; images: Img[] };

async function post(body: unknown) {
  await fetch("/api/admin/galleries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default function GalleriesClient({ galleries }: { galleries: Gallery[] }) {
  const router = useRouter();

  async function add(galleryId: number, imageRef: string) {
    await post({ action: "add", galleryId, imageRef });
    router.refresh();
  }
  async function remove(id: number) {
    await post({ action: "remove", id });
    router.refresh();
  }
  async function move(galleryId: number, images: Img[], index: number, dir: -1 | 1) {
    const next = [...images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    await post({ action: "reorder", galleryId, ids: next.map((i) => i.id) });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {galleries.map((g) => (
        <Card key={g.id}>
          <h2 className="mb-4 font-display text-xl">
            {g.title} <span className="text-sm text-white/40">({g.key})</span>
          </h2>

          <div className="mb-5 flex flex-wrap gap-3">
            {g.images.map((img, i) => (
              <div key={img.id} className="w-28">
                <div className="h-28 w-28 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageRef} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <button onClick={() => move(g.id, g.images, i, -1)} disabled={i === 0} className="px-1 disabled:opacity-30">
                    ↑
                  </button>
                  <button onClick={() => move(g.id, g.images, i, 1)} disabled={i === g.images.length - 1} className="px-1 disabled:opacity-30">
                    ↓
                  </button>
                  <button onClick={() => remove(img.id)} className="text-red-400 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {g.images.length === 0 && <p className="text-sm text-white/40">No images yet.</p>}
          </div>

          <ImagePicker label="Add image" value={null} onChange={(ref) => add(g.id, ref)} />
        </Card>
      ))}
    </div>
  );
}
