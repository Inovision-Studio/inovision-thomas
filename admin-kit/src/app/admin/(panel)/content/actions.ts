"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { setSetting } from "@/lib/settings";
import { CONTENT_FIELDS } from "@/lib/content";

export async function saveContent(formData: FormData) {
  await requireOwner();
  await Promise.all(
    CONTENT_FIELDS.map((f) => {
      const raw = String(formData.get(f.key) ?? "").slice(0, 4000);
      // Storing "" means "fall back to the shipped default", so clearing a field
      // restores the original copy rather than blanking the site.
      return setSetting(f.key, raw.trim());
    }),
  );
  revalidatePath("/", "layout");
}
