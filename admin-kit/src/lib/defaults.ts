import { CONTENT_DEFAULTS, CONTENT_FIELDS } from "./content";

// Original (seeded) values — used by the admin "Reset to default" buttons.
// Copy/section text lives in CONTENT_FIELDS (single source of truth); this
// spreads it in so Reset writes exactly what the site would fall back to anyway.
export const DEFAULT_SETTINGS: Record<string, string> = {
  ...CONTENT_DEFAULTS,
  accent_color: "#ff5a1f",
  font_display: "",
  font_body: "",
  business_name: "Your Store",
  business_blurb: "",
  vertical: "retail",
  age_gate: "",
  phone: "",
  address: "",
  maps_url: "",
  instagram: "",
  facebook: "",
  logo_ref: "",
  favicon_ref: "",
  home_layout: "",
};

// Every homepage copy key: hero/welcome/section groups plus the two banners.
const HOME_CONTENT_KEYS = CONTENT_FIELDS.filter(
  (f) => f.group.startsWith("Section ·") || f.group === "Top banner",
).map((f) => f.key);

// Which setting keys each reset scope restores.
export const RESET_SCOPES: Record<string, string[]> = {
  theme: ["accent_color", "font_display", "font_body", "logo_ref", "favicon_ref"],
  home: [...HOME_CONTENT_KEYS, "home_layout"],
  // Design and copy only. Contact details, socials and integration keys are
  // business data the owner entered — resetting them is data loss, not a reset.
  all: [
    "accent_color",
    "font_display",
    "font_body",
    "logo_ref",
    "favicon_ref",
    ...HOME_CONTENT_KEYS,
    "home_layout",
    "business_name",
  ],
};
