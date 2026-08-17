"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

// same check every other admin route uses
const guard = requireOwner;

function parse(fd: FormData) {
  const priceMaxRaw = String(fd.get("priceMax") ?? "").trim();
  let images: string[] = [];
  try {
    images = JSON.parse(String(fd.get("images") ?? "[]"));
  } catch {
    images = [];
  }
  return {
    name: String(fd.get("name") ?? "").trim(),
    slug: String(fd.get("slug") ?? "").trim(),
    category: String(fd.get("category") ?? "Accessories"),
    priceMin: Number(fd.get("priceMin") ?? 0),
    priceMax: priceMaxRaw === "" ? null : Number(priceMaxRaw),
    description: String(fd.get("description") ?? ""),
    images: images.filter((r) => typeof r === "string" && r),
    published: fd.get("published") === "on",
    sort: Number(fd.get("sort") ?? 0),
  };
}

function revalidate() {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function createProduct(fd: FormData) {
  await guard();
  const data = parse(fd);
  if (!data.name || !data.slug) throw new Error("Name and slug are required");
  await db.product.create({ data });
  revalidate();
  redirect("/admin/products");
}

export async function updateProduct(id: number, fd: FormData) {
  await guard();
  const data = parse(fd);
  if (!data.name || !data.slug) throw new Error("Name and slug are required");
  await db.product.update({ where: { id }, data });
  revalidate();
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await guard();
  await db.product.delete({ where: { id } });
  revalidate();
}
