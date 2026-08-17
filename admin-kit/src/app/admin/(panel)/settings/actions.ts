"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { setSetting } from "@/lib/settings";

const SETTING_KEYS = [
  "business_name",
  "business_blurb",
  "age_gate",
  "phone",
  "address",
  "maps_url",
  "instagram",
  "facebook",
  "ga_measurement_id",
  "google_review_link",
] as const;

export async function saveSettings(fd: FormData) {
  await requireOwner();
  await Promise.all(SETTING_KEYS.map((k) => setSetting(k, String(fd.get(k) ?? "").trim())));
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout"); // phone/address/socials render on the public site
}
