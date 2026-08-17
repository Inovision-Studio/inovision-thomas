/** Widths the image API will actually render; anything else falls back to the original. */
const VARIANTS = [200, 400, 800, 1200, 1600, 2000, 2400] as const;
export type Variant = (typeof VARIANTS)[number];

/** Request a resized variant from the image API; static/public files pass through. */
export function sized(ref: string, w: Variant): string {
  return ref.startsWith("/api/") ? `${ref}?w=${w}` : ref;
}

/**
 * Candidate set for the browser to pick from by device-pixel-ratio. A 400px-wide
 * card on a 3x phone needs 1200 real pixels — serving one fixed width is what
 * makes images look soft on retina/mobile.
 */
export function srcSet(ref: string, max: Variant = 2000): string | undefined {
  if (!ref.startsWith("/api/")) return undefined;
  return VARIANTS.filter((w) => w <= max)
    .map((w) => `${ref}?w=${w} ${w}w`)
    .join(", ");
}
