"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { setSetting } from "@/lib/settings";

export async function saveAccent(color: string) {
  await requireOwner();
  const hex = /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#ff5a1f";
  await setSetting("accent_color", hex);
  revalidatePath("/", "layout");
}

export async function saveFonts(display: string, body: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireOwner();
  // parseFont enforces the Google allow-list and the custom-hash shape, so an
  // arbitrary string can never reach the CSS/URL we build in layout.tsx.
  const { parseFont, serializeFont } = await import("@/lib/fonts");
  const d = parseFont(display);
  const b = parseFont(body);
  if ((display && d.kind === "default") || (body && b.kind === "default")) {
    return { ok: false, error: "That font isn't on the allowed list." };
  }
  await Promise.all([setSetting("font_display", serializeFont(d)), setSetting("font_body", serializeFont(b))]);
  revalidatePath("/", "layout");
  return { ok: true };
}

const REF = /^\/(api\/img\/[a-z0-9._-]+|[a-z0-9._-]+\.(webp|png|jpg|jpeg|svg|ico))$/i;

export async function saveBrand(refs: { logo_ref: string; favicon_ref: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireOwner();
  const logo = refs.logo_ref.trim();
  const fav = refs.favicon_ref.trim();
  if ((logo && !REF.test(logo)) || (fav && !REF.test(fav))) return { ok: false, error: "Pick images from the library or upload them." };
  await Promise.all([setSetting("logo_ref", logo), setSetting("favicon_ref", fav)]);
  revalidatePath("/", "layout");
  return { ok: true };
}
