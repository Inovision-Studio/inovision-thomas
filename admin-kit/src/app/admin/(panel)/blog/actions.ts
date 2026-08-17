"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { db } from "@/lib/db";

// same check every other admin route uses
const guard = requireOwner;

function parse(fd: FormData) {
  const image = String(fd.get("image") ?? "").trim();
  return {
    title: String(fd.get("title") ?? "").trim(),
    slug: String(fd.get("slug") ?? "").trim(),
    body: String(fd.get("body") ?? ""),
    excerpt: String(fd.get("excerpt") ?? "").trim().slice(0, 160),
    tags: String(fd.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
      .filter(Boolean)
      .slice(0, 6),
    image: image || null,
    published: fd.get("published") === "on",
  };
}

function revalidate() {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/news");
  revalidatePath("/"); // homepage shows the latest 3
  revalidatePath("/blog/[slug]", "page");
}

export async function createPost(fd: FormData) {
  await guard();
  const data = parse(fd);
  if (!data.title || !data.slug) throw new Error("Title and slug are required");
  await db.blogPost.create({ data });
  revalidate();
  redirect("/admin/blog");
}

export async function updatePost(id: number, fd: FormData) {
  await guard();
  const data = parse(fd);
  if (!data.title || !data.slug) throw new Error("Title and slug are required");
  await db.blogPost.update({ where: { id }, data });
  revalidate();
  redirect("/admin/blog");
}

export async function deletePost(id: number) {
  await guard();
  await db.blogPost.delete({ where: { id } });
  revalidate();
}
