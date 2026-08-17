import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";

/**
 * Shared Gemini plumbing for the chat widget and the blog AI. Raw fetch, no
 * SDK — the API is a single JSON POST and this keeps the bundle small.
 */
export const TEXT_MODEL = "gemini-flash-lite-latest"; // chat: cheapest, short replies
/**
 * Blog drafting needs reliable JSON-schema output; the lite alias sometimes
 * loops until MAX_TOKENS in schema mode. Try these in order until one parses.
 */
export const DRAFT_MODELS = ["gemini-3.5-flash-lite", "gemini-flash-latest", "gemini-flash-lite-latest"];
// ponytail: image model ids churn; if this one is retired swap the constant.
export const IMAGE_MODEL = "gemini-2.5-flash-image";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export type GeminiPart = { text?: string; inlineData?: { mimeType: string; data: string } };
export type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
};

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/** POST to generateContent; throws GeminiError with Google's message on failure. */
export async function generate(model: string, body: unknown): Promise<GeminiResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError("Gemini is not configured (GEMINI_API_KEY missing).", 503);
  const res = await fetch(`${ENDPOINT}/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  if (!res) throw new GeminiError("Could not reach Gemini.");
  const data = (await res.json().catch(() => null)) as GeminiResponse | null;
  if (!res.ok || !data) {
    throw new GeminiError(data?.error?.message || `Gemini returned ${res.status}.`);
  }
  if (data.promptFeedback?.blockReason) {
    throw new GeminiError(`Gemini declined the request (${data.promptFeedback.blockReason}).`);
  }
  return data;
}

export function textOf(res: GeminiResponse): string {
  return res.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ?? "";
}

export function imageOf(res: GeminiResponse): { mime: string; bytes: Buffer } | null {
  for (const c of res.candidates ?? []) {
    for (const p of c.content?.parts ?? []) {
      if (p.inlineData?.data) return { mime: p.inlineData.mimeType, bytes: Buffer.from(p.inlineData.data, "base64") };
    }
  }
  return null;
}

// store context cached in memory — one DB read per instance per 5 min
let ctxCache: { text: string; at: number } | null = null;
export async function storeContext(): Promise<string> {
  if (ctxCache && Date.now() - ctxCache.at < 5 * 60 * 1000) return ctxCache.text;
  const [s, hours, products] = await Promise.all([
    getSettings().catch(() => ({}) as Record<string, string>),
    db.businessHour.findMany({ orderBy: { day: "asc" } }).catch(() => []),
    db.product
      .findMany({
        where: { published: true },
        orderBy: { sort: "asc" },
        select: { name: true, category: true, priceMin: true, priceMax: true },
        take: 40,
      })
      .catch(() => []),
  ]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hourLines = hours
    .map((h) => `${days[h.day]}: ${h.closed ? "Closed" : `${h.open}–${h.close}`}`)
    .join(", ");
  const productLines = products
    .map((p) => `${p.name} (${p.category}) $${p.priceMin}${p.priceMax ? `–$${p.priceMax}` : ""}`)
    .join("; ");
  const text = [
    `Business: ${s.business_name || "our store"}`,
    s.business_blurb ? `About: ${s.business_blurb}` : "",
    s.address ? `Address: ${s.address}` : "",
    s.phone ? `Phone: ${s.phone}` : "",
    hourLines ? `Hours: ${hourLines}` : "",
    `Products in stock: ${productLines}`,
  ]
    .filter(Boolean)
    .join("\n");
  ctxCache = { text, at: Date.now() };
  return text;
}

/**
 * Try several models in order. `accept` decides whether a response is usable
 * (e.g. its JSON parses); a rejected or errored model falls through to the next.
 * Throws the last error only if every model fails.
 */
export async function generateWithFallback<T>(
  models: string[],
  body: unknown,
  accept: (res: GeminiResponse) => T | null,
): Promise<T> {
  let lastErr: GeminiError | null = null;
  for (const model of models) {
    try {
      const res = await generate(model, body);
      const out = accept(res);
      if (out !== null) return out;
      lastErr = new GeminiError(`${model} returned an unusable answer.`);
    } catch (e) {
      lastErr = e as GeminiError;
      // hard stops that no other model will fix
      if (lastErr.status === 503 && /not configured/i.test(lastErr.message)) throw lastErr;
    }
  }
  throw lastErr ?? new GeminiError("AI request failed.");
}
