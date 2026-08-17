"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { setSetting } from "@/lib/settings";
import { CONTENT_FIELDS } from "@/lib/content";
import { sanitizeLayout, type HomeLayout } from "@/lib/homeLayout";

const IMAGE_REF = /^\/(api\/img\/[a-z0-9._-]+|[a-z0-9._-]+\.(webp|png|jpg|jpeg|svg|gif))$/i;

export async function saveVisualEdits(input: {
  content: Record<string, string>;
  layout?: HomeLayout;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireOwner();
  const allowed = new Map(CONTENT_FIELDS.map((f) => [f.key, f]));
  const writes: Promise<unknown>[] = [];

  for (const [k, v] of Object.entries(input.content ?? {})) {
    const f = allowed.get(k);
    if (!f) continue; // unknown key → ignore, never write
    const val = String(v ?? "")
      .slice(0, f.type === "text" ? 300 : 4000)
      .trim();
    if (f.type === "image" && val && !IMAGE_REF.test(val)) {
      return { ok: false, error: `That doesn't look like a site image for "${f.label}".` };
    }
    // "" means "use the shipped default" — same contract as the Site Content form
    writes.push(setSetting(k, val));
  }

  if (input.layout) {
    writes.push(setSetting("home_layout", JSON.stringify(sanitizeLayout(input.layout))));
  }

  await Promise.all(writes);
  revalidatePath("/", "layout");
  return { ok: true };
}
