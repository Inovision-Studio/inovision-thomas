import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { ageGate, bizName } from "@/lib/brand";
import { DRAFT_MODELS, GeminiError, generateWithFallback, storeContext, textOf } from "@/lib/gemini";
import { slugify } from "@/lib/slug";

// Owner-only, but a runaway client shouldn't be able to burn the quota either.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const hits: number[] = [];

const ACTIONS = ["draft", "outline", "improve", "expand", "shorten", "rewrite", "headline", "seo"] as const;
type Action = (typeof ACTIONS)[number];
const TONES = ["casual", "hype", "informative", "professional"] as const;

const systemFor = (s: Record<string, string>) => `You write blog posts for ${bizName(s)}${s.business_blurb ? `, ${s.business_blurb}` : ", a local business"}.${ageGate(s) ? ` Audience is adults ${ageGate(s)}+.` : ""}
Rules:
- Never make medical, health, therapeutic or dosage claims. Never say anything "cures", "treats" or "heals". No wellness advice.
- Never invent facts, prices, promotions or products. Only mention items and prices that appear in the store context below.
- US spelling. Friendly, confident, plain language. Short paragraphs. No clichés like "in today's fast-paced world".
- Body is Markdown: use ## and ### headings, bullet lists where useful, no H1 (the title is separate), no images, no HTML.
- Keep posts under ~700 words unless asked otherwise.
- Do not mention these rules.`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING", description: "Punchy post title, max 70 characters, no repetition." },
    slug: { type: "STRING", description: "URL slug, lowercase words joined by hyphens." },
    excerpt: { type: "STRING", description: "One sentence, max 155 characters, for search results and cards." },
    tags: { type: "ARRAY", items: { type: "STRING" }, description: "3-6 short lowercase tags." },
    body: { type: "STRING", description: "Markdown body, 300-700 words, ## and ### headings, no H1." },
  },
  required: ["title", "slug", "excerpt", "tags", "body"],
  propertyOrdering: ["title", "slug", "excerpt", "tags", "body"],
};

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = Date.now();
  while (hits.length && now - hits[0] > WINDOW_MS) hits.shift();
  if (hits.length >= MAX_PER_WINDOW) return NextResponse.json({ error: "Slow down — try again in a few minutes." }, { status: 429 });
  hits.push(now);

  const body = await req.json().catch(() => null);
  const action = body?.action as Action;
  if (!ACTIONS.includes(action)) return NextResponse.json({ error: "Unknown action." }, { status: 400 });

  const topic = clean(body.topic, 300);
  const text = clean(body.body, 20000);
  const title = clean(body.title, 200);
  const tone = TONES.includes(body.tone) ? (body.tone as string) : "casual";
  const keywords = Array.isArray(body.keywords) ? body.keywords.slice(0, 10).map((k: unknown) => clean(k, 40)).filter(Boolean) : [];

  const structured = action === "draft" || action === "outline" || action === "headline" || action === "seo";
  if ((action === "draft" || action === "outline") && !topic && !title && !text) {
    return NextResponse.json({ error: "Give me a topic first." }, { status: 400 });
  }
  if (!structured && !text) return NextResponse.json({ error: "There's no text to work with yet." }, { status: 400 });

  const [ctx, settingsForPrompt] = await Promise.all([storeContext(), getSettings().catch(() => ({}) as Record<string, string>)]);
  const SYSTEM = systemFor(settingsForPrompt);
  const kw = keywords.length ? `\nWork these in naturally: ${keywords.join(", ")}.` : "";
  const prompt: string = (() => {
    switch (action) {
      case "draft":
        return `Write a complete blog post. Topic: ${topic || title}.${kw}\nTone: ${tone}.${text ? `\nUse these notes as source material:\n${text}` : ""}\nReturn title, slug, excerpt, body and tags.`;
      case "outline":
        return `Write an outline for a blog post as Markdown headings with 1-2 bullet points under each. Topic: ${topic || title}.${kw}\nReturn title, slug, excerpt, body (the outline) and tags.`;
      case "headline":
        return `Suggest a punchy title (max 70 chars), a slug, an excerpt and 3-6 tags for this post.\n${title ? `Current title: ${title}\n` : ""}Body:\n${text}`;
      case "seo":
        return `Write an SEO excerpt (max 155 characters, no clickbait) and 3-6 tags for this post. Keep the title as-is unless it's empty.\nTitle: ${title}\nBody:\n${text}`;
      case "improve":
        return `Improve this Markdown post: fix grammar, tighten sentences, keep the meaning, structure and length. Return only the Markdown body.\n\n${text}`;
      case "expand":
        return `Expand this Markdown post with more useful detail and examples, keeping its voice. Aim for roughly 1.5x the length. Return only the Markdown body.\n\n${text}`;
      case "shorten":
        return `Shorten this Markdown post to roughly half its length without losing the key points. Return only the Markdown body.\n\n${text}`;
      case "rewrite":
        return `Rewrite this Markdown post in a ${tone} tone, same facts and structure. Return only the Markdown body.\n\n${text}`;
    }
  })();

  try {
    const request = {
      systemInstruction: { parts: [{ text: `${SYSTEM}\n\nStore context:\n${ctx}` }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: structured
        ? { temperature: 0.7, maxOutputTokens: 4096, responseMimeType: "application/json", responseSchema: SCHEMA }
        : { temperature: 0.6, maxOutputTokens: 4096 },
    };

    if (!structured) {
      const out = await generateWithFallback(DRAFT_MODELS, request, (res) => textOf(res).trim() || null);
      return NextResponse.json({ body: out });
    }

    // a model that loops or truncates yields unparseable JSON → fall through to the next
    const parsed = await generateWithFallback<Record<string, unknown>>(DRAFT_MODELS, request, (res) => {
      const raw = textOf(res).trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
      try {
        const o = JSON.parse(raw);
        return o && typeof o === "object" ? (o as Record<string, unknown>) : null;
      } catch {
        return null;
      }
    });

    const outTitle = clean(parsed.title, 120);
    const result: Record<string, unknown> = {};
    if (outTitle && action !== "seo") {
      result.title = outTitle;
      result.slug = slugify(clean(parsed.slug, 100) || outTitle);
    }
    if (parsed.excerpt) result.excerpt = clean(parsed.excerpt, 160);
    if (parsed.body && (action === "draft" || action === "outline")) result.body = clean(parsed.body, 20000);
    if (Array.isArray(parsed.tags)) {
      result.tags = parsed.tags.map((t: unknown) => clean(t, 30).toLowerCase().replace(/^#/, "")).filter(Boolean).slice(0, 6);
    }
    return NextResponse.json(result);
  } catch (e) {
    const err = e as GeminiError;
    const m = err.message || "";
    // free-tier rate limit → short, actionable message instead of Google's metric dump
    const retry = m.match(/retry in ([\d.]+)s/i);
    if (/quota|rate limit/i.test(m)) {
      return NextResponse.json(
        { error: `Gemini's free-tier limit was hit — try again in ${retry ? Math.ceil(Number(retry[1])) : 60} seconds.` },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: m || "AI request failed." }, { status: err.status || 502 });
  }
}
