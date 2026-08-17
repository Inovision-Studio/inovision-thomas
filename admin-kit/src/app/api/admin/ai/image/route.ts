import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { generate, GeminiError, imageOf, IMAGE_MODEL } from "@/lib/gemini";
import { storeImage } from "@/lib/storeImage";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10; // images cost real money
const hits: number[] = [];

const STYLES = {
  product:
    "hero product photograph on a dark matte surface, single glass piece or sleek vape device silhouette, shallow depth of field, soft rim light",
  lifestyle:
    "atmospheric interior of a modern smoke shop lounge, warm neon orange glow on shelves, gentle drifting smoke, empty scene, cinematic wide shot",
  abstract: "abstract swirling smoke and light trails, orange on black, soft gradient haze, elegant and minimal",
} as const;
type Style = keyof typeof STYLES;

const RULES =
  "Dark, moody smoke-shop aesthetic: deep charcoal and black background with warm orange (#ff5a1f) accent lighting and highlights. Photorealistic, high detail. Absolutely no text, letters, words, numbers, watermarks, logos or brand marks anywhere in the image. No people, no faces, no hands, no animals. Wide 16:9 landscape composition with breathing room.";

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = Date.now();
  while (hits.length && now - hits[0] > WINDOW_MS) hits.shift();
  if (hits.length >= MAX_PER_WINDOW) return NextResponse.json({ error: "Image limit reached — try again in a few minutes." }, { status: 429 });
  hits.push(now);

  const body = await req.json().catch(() => null);
  const title = String(body?.title ?? "").trim().slice(0, 200);
  const excerpt = String(body?.excerpt ?? "").trim().slice(0, 300);
  const style: Style = body?.style in STYLES ? body.style : "abstract";
  if (!title) return NextResponse.json({ error: "Give the post a title first — it drives the image." }, { status: 400 });

  const prompt = `${STYLES[style]}. Subject inspiration: "${title}"${excerpt ? ` — ${excerpt}` : ""}. ${RULES}`;

  try {
    // imageConfig.aspectRatio follows the current generateContent reference; if a
    // model rejects it the sharp cover-crop below still yields a 16:9 result.
    const res = await generate(IMAGE_MODEL, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } },
    });
    const img = imageOf(res);
    if (!img) return NextResponse.json({ error: "Gemini returned no image — try again or pick another style." }, { status: 502 });
    const stored = await storeImage(img.bytes, { cover: { width: 2400, height: 1350 } });
    return NextResponse.json({ ok: true, ...stored });
  } catch (e) {
    const err = e as GeminiError;
    // The free Gemini tier has a hard limit of 0 on image models; Google's raw
    // message is a wall of quota metrics, so say what the owner can actually do.
    if (/quota|limit: 0|billing/i.test(err.message || "")) {
      return NextResponse.json(
        { error: "Image generation isn't enabled on your Gemini plan yet — text features work on the free tier, but images need billing turned on in Google AI Studio for this API key." },
        { status: 402 },
      );
    }
    return NextResponse.json({ error: err.message || "Image generation failed." }, { status: err.status || 502 });
  }
}
