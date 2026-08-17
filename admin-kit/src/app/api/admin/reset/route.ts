import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { setSetting } from "@/lib/settings";
import { DEFAULT_SETTINGS, RESET_SCOPES } from "@/lib/defaults";
import { revalidatePath } from "next/cache";

// Restore a group of settings to their original seeded values.
export async function POST(req: Request) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { scope } = await req.json().catch(() => ({ scope: "" }));
  const keys = RESET_SCOPES[scope as string];
  if (!keys) return NextResponse.json({ error: "Unknown scope" }, { status: 400 });

  await Promise.all(keys.map((k) => setSetting(k, DEFAULT_SETTINGS[k] ?? "")));
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, reset: keys.length });
}
