import { db } from "@/lib/db";
import sharp from "sharp";

type Cached = { bytes: Uint8Array; mime: string };

// Images are immutable (content-addressed by hash / fixed id), so a process-level
// cache is safe and shields the DB from the ~70-request burst a page load fires.
// Resized variants cache under their own key.
const cache = new Map<string, Cached>();
const CACHE_MAX = 400;

// only these widths are honored — anything else serves the original,
// so query strings can't be abused to churn CPU/cache
const ALLOWED_WIDTHS = new Set([200, 400, 800, 1200, 1600, 2000, 2400]);

async function findWithRetry(where: { hash: string } | { id: number }) {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await db.image.findUnique({ where } as never);
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function respond(hit: Cached): Response {
  return new Response(hit.bytes.slice(), {
    headers: { "Content-Type": hit.mime, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}

function remember(key: string, hit: Cached) {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, hit);
}

export async function serveImage(
  key: string,
  where: { hash: string } | { id: number },
  width?: number,
): Promise<Response> {
  const w = width && ALLOWED_WIDTHS.has(width) ? width : undefined;
  const cacheKey = w ? `${key}@${w}` : key;

  const hit = cache.get(cacheKey);
  if (hit) return respond(hit);

  let img;
  try {
    img = await findWithRetry(where);
  } catch {
    return new Response("Image temporarily unavailable", { status: 503, headers: { "Retry-After": "2" } });
  }
  if (!img) return new Response("Not found", { status: 404 });

  let bytes = new Uint8Array(img.bytes);
  let mime = img.mime;
  if (w) {
    try {
      const src = sharp(Buffer.from(img.bytes));
      const meta = await src.metadata();
      // Asking for >= the original width would only re-encode it (a second lossy
      // pass on already-webp bytes = visible softening). Serve the original instead.
      if (!meta.width || w < meta.width) {
        bytes = new Uint8Array(
          await src
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: 88 })
            .toBuffer(),
        );
        mime = "image/webp";
      }
    } catch {
      // undecodable? serve the original rather than erroring
      bytes = new Uint8Array(img.bytes);
      mime = img.mime;
    }
  }

  const entry = { bytes, mime };
  remember(cacheKey, entry);
  return respond(entry);
}

export function widthFromUrl(url: string): number | undefined {
  const w = parseInt(new URL(url).searchParams.get("w") || "", 10);
  return Number.isFinite(w) ? w : undefined;
}
