/**
 * Every editable string on the public site. The `def` value is what ships when
 * the owner has not overridden it, so adding a field here changes nothing until
 * they type something. One entry = one field in Admin → Content.
 */
export type ContentField = {
  key: string;
  label: string;
  group: string;
  type: "text" | "textarea" | "list" | "image";
  def: string;
  hint?: string;
};

export const CONTENT_FIELDS: ContentField[] = [
  // --- top banner -----------------------------------------------------------
  {
    key: "banner_lines",
    label: "Scrolling banner",
    group: "Top banner",
    type: "list",
    hint: "One phrase per line — they scroll across the orange bar.",
    def: [
      "\u2605\u2605\u2605\u2605\u2605 Loved by Locals",
      "New Arrivals Weekly",
      "Reserve Online \u00b7 Pick Up In-Store",
      "Locally Owned",
      "Friendly, Expert Staff",
    ].join("\n"),
  },
  {
    key: "tagline_lines",
    label: "Tagline strip",
    group: "Top banner",
    type: "list",
    hint: "The large scrolling line further down the homepage.",
    def: [
      "Your Neighborhood Favorite",
      "New Arrivals Weekly",
      "Locally Owned",
      "Reserve Online \u00b7 Pick Up In-Store",
    ].join("\n"),
  },

  // --- hero -----------------------------------------------------------------
  { key: "home_hero_kicker", label: "Kicker", group: "Section · Hero", type: "text", def: "Your Neighborhood Store" },
  { key: "home_hero_title", label: "Headline", group: "Section · Hero", type: "text", def: "Your Store." },
  {
    key: "home_hero_sub",
    label: "Subtitle",
    group: "Section · Hero",
    type: "textarea",
    def: "Everything you came for and a few things you didn't know you needed \u2014 restocked every week. Come see what's new.",
  },
  { key: "hero_cta_shop", label: "Primary button", group: "Section · Hero", type: "text", def: "Shop the catalog" },
  { key: "hero_cta_directions", label: "Directions button", group: "Section · Hero", type: "text", def: "Get directions" },

  // --- welcome / mascot -----------------------------------------------------
  { key: "welcome_kicker", label: "Kicker", group: "Section · Welcome", type: "text", def: "Welcome" },
  { key: "welcome_title", label: "Heading", group: "Section · Welcome", type: "text", def: "Your One-Stop Shop" },
  {
    key: "welcome_body",
    label: "Body",
    group: "Section · Welcome",
    type: "textarea",
    def: "We're your one-stop spot for everything you need \u2014 quality products, fair prices and staff who actually know what they're talking about. New arrivals every week and a selection that's tough to beat.",
  },
  { key: "welcome_cta_shop", label: "Primary button", group: "Section · Welcome", type: "text", def: "Shop the catalog" },
  { key: "welcome_cta_about", label: "Secondary button", group: "Section · Welcome", type: "text", def: "About the store" },
  { key: "mascot_ref", label: "Mascot image", group: "Section · Welcome", type: "image", def: "", hint: "Leave empty to hide the mascot." },
  { key: "mascot_egg_lines", label: "Mascot quips", group: "Section · Welcome", type: "list", hint: "Random line shown when a visitor pokes the mascot. Every 3rd poke opens the chat.", def: ["New drops every week!", "Tap me twice more and I'll chat 👀", "Check the fresh drops below 👇"].join("\n") },

  // --- AI assistant ---------------------------------------------------------
  { key: "bot_name", label: "Assistant name", group: "AI assistant", type: "text", def: "", hint: "Shown on the chat bubble and 'Ask … AI' buttons. Empty = your business name." },
  { key: "bot_avatar_ref", label: "Assistant avatar", group: "AI assistant", type: "image", def: "", hint: "Small square image. Empty = mascot, then logo." },
  { key: "chat_greeting", label: "First message", group: "AI assistant", type: "textarea", def: "Hey! Ask me about products, prices, hours — whatever you need." },
  { key: "chat_suggestions", label: "Suggested questions", group: "AI assistant", type: "list", def: ["What are your hours?", "What's new this week?", "Where are you located?"].join("\n") },
  { key: "ai_persona", label: "Assistant personality", group: "AI assistant", type: "textarea", def: "friendly, short, casual and upbeat", hint: "One line. Fed to the AI as its tone." },

  // --- merch / featured video -----------------------------------------------
  { key: "merch_videos", label: "Video files", group: "Section · Merch", type: "list", def: "", hint: "One video URL per line (mp4/webm from /public or any https URL). Empty hides the whole section." },
  { key: "merch_poster", label: "Poster image", group: "Section · Merch", type: "image", def: "", hint: "Shown before the video loads." },

  // --- homepage sections ----------------------------------------------------
  { key: "sec_inside_kicker", label: "Kicker", group: "Section · Step Inside", type: "text", def: "Step inside" },
  { key: "sec_inside_title", label: "Heading", group: "Section · Step Inside", type: "text", def: "Step Inside" },
  { key: "sec_inside_link", label: "Link text", group: "Section · Step Inside", type: "text", def: "Browse the catalog →" },

  { key: "sec_cats_kicker", label: "Kicker", group: "Section · Categories", type: "text", def: "What we carry" },
  { key: "sec_cats_title", label: "Heading", group: "Section · Categories", type: "text", def: "Something for everyone" },

  { key: "sec_vip_kicker", label: "Kicker", group: "Section · VIP", type: "text", def: "Deals & drops" },
  { key: "sec_vip_title", label: "Heading", group: "Section · VIP", type: "text", def: "VIP exclusives" },
  {
    key: "sec_vip_body",
    label: "Body",
    group: "Section · VIP",
    type: "textarea",
    def: "Join the list for first look at new arrivals and members-only deals. No spam — just drops.",
  },

  { key: "sec_why_kicker", label: "Kicker", group: "Section · Why us", type: "text", def: "Why us" },
  { key: "sec_why_title", label: "Heading", group: "Section · Why us", type: "text", def: "Stocked for everyone" },
  {
    key: "why_items",
    label: "Three points",
    group: "Section · Why us",
    type: "list",
    hint: "One per line, as: Title | description",
    def: [
      "Restocked weekly | New arrivals land constantly \u2014 the shelves never go stale.",
      "Locally owned | Neighborhood shop, staff who actually know the products.",
      "Reserve online | Lock in what you want, pick it up in store.",
    ].join("\n"),
  },

  { key: "sec_products_kicker", label: "Kicker", group: "Section · Products", type: "text", def: "In the shop" },
  { key: "sec_products_title", label: "Heading", group: "Section · Products", type: "text", def: "New arrivals & bestsellers" },
  { key: "sec_products_link", label: "Link text", group: "Section · Products", type: "text", def: "View all →" },

  { key: "sec_merch_kicker", label: "Kicker", group: "Section · Merch", type: "text", def: "Featured" },
  { key: "sec_merch_title", label: "Heading", group: "Section · Merch", type: "text", def: "See it in action" },
  {
    key: "sec_merch_body",
    label: "Body",
    group: "Section · Merch",
    type: "textarea",
    def: "A closer look at what makes us different. Limited runs, in-store only \u2014 come grab yours.",
  },
  { key: "sec_merch_cta_ask", label: "Primary button", group: "Section · Merch", type: "text", def: "Ask about it" },
  { key: "sec_merch_cta_shop", label: "Secondary button", group: "Section · Merch", type: "text", def: "Browse the shop" },

  { key: "sec_reviews_kicker", label: "Kicker", group: "Section · Reviews", type: "text", def: "★★★★★" },
  { key: "sec_reviews_title", label: "Heading", group: "Section · Reviews", type: "text", def: "What locals say" },
  { key: "sec_blog_kicker", label: "Kicker", group: "Section · Blog", type: "text", def: "From the blog" },
  { key: "sec_blog_title", label: "Heading", group: "Section · Blog", type: "text", def: "Latest news & reads" },
  { key: "sec_blog_link", label: "Link text", group: "Section · Blog", type: "text", def: "Read the blog →" },

  // --- other pages ----------------------------------------------------------
  {
    key: "footer_blurb",
    label: "Footer description",
    group: "Footer",
    type: "textarea",
    def: "Your neighborhood's favorite local store \u2014 quality products, friendly faces, fair prices.",
  },
  { key: "sec_reviews_nudge", label: "Review nudge", group: "Section · Reviews", type: "textarea", def: "Loved your visit? It takes 10 seconds to tell Google, and it helps a local business more than you know." },

  // --- other pages ----------------------------------------------------------
  { key: "about_title", label: "Heading", group: "About page", type: "text", def: "More than a store. A destination." },
  { key: "about_body", label: "About paragraph", group: "About page", type: "textarea", def: "We're your neighborhood spot — locally owned, stocked with what you actually want, and staffed by people who know the products. Come say hi." },
  { key: "careers_title", label: "Heading", group: "Careers page", type: "text", def: "Join the crew" },
  { key: "careers_footer", label: "Fine print", group: "Careers page", type: "textarea", def: "Must be 18+ to apply. We are an equal-opportunity employer." },
  { key: "agegate_title", label: "Age gate heading", group: "Age gate", type: "text", def: "Are you {age} or older?", hint: "{age} is replaced with the number from Settings → Age gate." },

  {
    key: "careers_positions",
    label: "Open positions",
    group: "Careers",
    type: "list",
    hint: "One role per line. Also fills the application form's dropdown.",
    def: ["Sales Associate", "Shift Lead", "Inventory", "Social / Marketing"].join("\n"),
  },
  {
    key: "careers_intro",
    label: "Intro paragraph",
    group: "Careers",
    type: "textarea",
    def: "Love the vibe? Come work at your neighborhood favorite. Friendly team, flexible shifts, and employee discounts.",
  },
];

const DEFAULTS: Record<string, string> = Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.def]));

/** Owner's value when set, otherwise the shipped default. */
export function text(settings: Record<string, string>, key: string): string {
  const v = settings[key];
  return v && v.trim() ? v : (DEFAULTS[key] ?? "");
}

/** A list field split into trimmed, non-empty lines. */
export function lines(settings: Record<string, string>, key: string): string[] {
  return text(settings, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export const CONTENT_DEFAULTS = DEFAULTS;
