/**
 * Runtime font choices. Defaults are the self-hosted next/font families; the
 * owner can swap either slot for a curated Google Font or an uploaded file.
 * Setting values: "" (default) | "google:<Family>" | "custom:<hash>|<display name>".
 */
export const DISPLAY_FONTS = [
  "Bebas Neue",
  "Anton",
  "Oswald",
  "Teko",
  "Bangers",
  "Black Ops One",
  "Russo One",
  "Righteous",
  "Bungee",
  "Archivo Black",
  "Rubik Mono One",
  "Big Shoulders Display",
  "Chakra Petch",
  "Orbitron",
  "Audiowide",
  "Permanent Marker",
  "Luckiest Guy",
  "Fredoka",
  "Poppins",
  "Montserrat",
  "Space Grotesk",
  "Sora",
  "DM Sans",
  "Inter",
  "Manrope",
  "Outfit",
  "Urbanist",
  "Lexend",
  "Nunito",
  "Work Sans",
] as const;

export const BODY_FONTS = [
  "Inter",
  "DM Sans",
  "Manrope",
  "Sora",
  "Poppins",
  "Montserrat",
  "Outfit",
  "Urbanist",
  "Lexend",
  "Nunito",
  "Work Sans",
  "Space Grotesk",
  "Rubik",
  "Karla",
  "Figtree",
  "IBM Plex Sans",
  "Source Sans 3",
  "Roboto",
  "Open Sans",
  "Lato",
] as const;

const ALL_GOOGLE = new Set<string>([...DISPLAY_FONTS, ...BODY_FONTS]);

export type FontChoice =
  | { kind: "default" }
  | { kind: "google"; family: string }
  | { kind: "custom"; hash: string; name: string; format: "woff2" | "truetype" | "opentype" };

export const CUSTOM_HASH = /^f_[a-f0-9]{32}\.(woff2|ttf|otf)$/;

export function parseFont(v: string | undefined | null): FontChoice {
  const s = (v ?? "").trim();
  if (!s) return { kind: "default" };
  if (s.startsWith("google:")) {
    const family = s.slice(7).trim();
    // allow-list guards the CSS/URL we build from this value
    return ALL_GOOGLE.has(family) ? { kind: "google", family } : { kind: "default" };
  }
  if (s.startsWith("custom:")) {
    const [hash, ...rest] = s.slice(7).split("|");
    if (!CUSTOM_HASH.test(hash)) return { kind: "default" };
    const ext = hash.split(".").pop();
    const format = ext === "woff2" ? "woff2" : ext === "ttf" ? "truetype" : "opentype";
    const name = (rest.join("|") || "Custom").replace(/["\;{}]/g, "").slice(0, 60);
    return { kind: "custom", hash, name, format };
  }
  return { kind: "default" };
}

export function serializeFont(c: FontChoice): string {
  if (c.kind === "google") return `google:${c.family}`;
  if (c.kind === "custom") return `custom:${c.hash}|${c.name}`;
  return "";
}

/** One css2 URL for many families (weights 400 + 700, swap). */
export function googleCss2Url(families: string[]): string {
  const fam = families.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;700`).join("&");
  return `https://fonts.googleapis.com/css2?${fam}&display=swap`;
}

/** What layout.tsx injects for the current choices. */
export function fontHead(display: FontChoice, body: FontChoice): { links: string[]; css: string } {
  const google: string[] = [];
  let css = "";
  const face = (c: Extract<FontChoice, { kind: "custom" }>, family: string) =>
    `@font-face{font-family:"${family}";src:url(/api/font/${c.hash}) format("${c.format}");font-display:swap;}`;

  const vars: string[] = [];
  if (display.kind === "google") {
    google.push(display.family);
    vars.push(`--font-display:"${display.family}"`);
  } else if (display.kind === "custom") {
    css += face(display, "SB Custom Display");
    vars.push(`--font-display:"SB Custom Display"`);
  }
  if (body.kind === "google") {
    google.push(body.family);
    vars.push(`--font-body:"${body.family}"`);
  } else if (body.kind === "custom") {
    css += face(body, "SB Custom Body");
    vars.push(`--font-body:"SB Custom Body"`);
  }
  if (vars.length) css += `:root{${vars.join(";")}}`;
  const links = google.length ? [googleCss2Url([...new Set(google)])] : [];
  return { links, css };
}
