import { NextResponse } from "next/server";
import { requireOwner, setOwnerPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const password = String(body.password ?? "");
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  await setOwnerPassword(password);
  return NextResponse.json({ ok: true });
}
