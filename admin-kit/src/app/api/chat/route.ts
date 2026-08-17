import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { storeContext, TEXT_MODEL } from "@/lib/gemini";
import { getSettings } from "@/lib/settings";
import { ageGate, bizName, botName } from "@/lib/brand";
import { text } from "@/lib/content";
import { track } from "@/lib/track";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
const QUOTA_COOKIE = "sb_chat";
const MAX_PER_WINDOW = 15; // messages per visitor
const WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours
const MAX_MSG_CHARS = 600;
const MAX_HISTORY = 12;

type Quota = { c: number; r: number };

async function readQuota(): Promise<Quota> {
  const token = (await cookies()).get(QUOTA_COOKIE)?.value;
  if (!token) return { c: 0, r: Date.now() + WINDOW_MS };
  try {
    const { payload } = await jwtVerify(token, secret);
    const q = payload as unknown as Quota;
    if (Date.now() > q.r) return { c: 0, r: Date.now() + WINDOW_MS };
    return q;
  } catch {
    return { c: 0, r: Date.now() + WINDOW_MS };
  }
}

async function writeQuota(q: Quota) {
  const token = await new SignJWT(q as unknown as Record<string, number>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5h")
    .sign(secret);
  (await cookies()).set(QUOTA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/chat",
    maxAge: 5 * 60 * 60,
  });
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Chat is not configured." }, { status: 503 });
  }

  const quota = await readQuota();
  if (quota.c >= MAX_PER_WINDOW) {
    const mins = Math.max(1, Math.ceil((quota.r - Date.now()) / 60000));
    return NextResponse.json(
      { reply: `You've reached the chat limit for now — try again in about ${mins} minutes, or just call or visit the shop! 🔥` },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const messages: Array<{ role: string; text: string }> = Array.isArray(body?.messages) ? body.messages : [];
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const trimmed = messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.text || "").slice(0, MAX_MSG_CHARS) }],
  }));

  const [context, s] = await Promise.all([storeContext(), getSettings().catch(() => ({}) as Record<string, string>)]);
  const age = ageGate(s);
  const systemInstruction = `You are "${botName(s)}", the ${text(s, "ai_persona")} assistant on the ${bizName(s)} website. Answer visitor questions using ONLY the business info below. Keep replies short (1-3 sentences). Products and prices come from the list — never invent items or prices. If you don't know something, suggest calling or visiting in person.${age ? ` All customers must be ${age}+.` : ""} Never give medical or health advice, and politely decline off-topic requests (homework, coding, etc.) — you only talk about this business.\n\n${context}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: trimmed,
      generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return NextResponse.json(
      { reply: "I'm having trouble right now — give the shop a call or stop by! 🔥" },
      { status: 200 },
    );
  }
  const data = await res.json().catch(() => null);
  const reply: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ||
    "Hmm, I lost my train of thought — ask me again?";

  await writeQuota({ c: quota.c + 1, r: quota.r });
  void track("chat", req);
  return NextResponse.json({ reply, remaining: MAX_PER_WINDOW - quota.c - 1 });
}
