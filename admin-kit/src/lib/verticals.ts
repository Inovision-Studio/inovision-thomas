/**
 * Per-business-type presets. Applied ONCE by `npm run new-client` (written into
 * Settings), after which the owner edits everything in the admin. Runtime never
 * reads this file — the admin is the source of truth.
 */
export type Vertical = "retail" | "smoke" | "food" | "service";

export type VerticalPreset = {
  label: string;
  age_gate: "" | "18" | "21";
  /** Content/setting overrides on top of the generic defaults. */
  content: Record<string, string>;
  /** Homepage sections to hide by default (owner can un-hide in Edit Home). */
  hidden: string[];
};

const L = (a: string[]) => a.join("\n");

export const VERTICALS: Record<Vertical, VerticalPreset> = {
  retail: {
    label: "Local retail / boutique",
    age_gate: "",
    content: {},
    hidden: ["merch"],
  },
  smoke: {
    label: "Smoke / vape shop (21+)",
    age_gate: "21",
    content: {
      banner_lines: L(["★★★★★ Loved by Locals", "Newest Vapes, Glass, Hookah & More", "Reserve Online · Pick Up In-Store", "New Drops Weekly", "Locally Owned", "21+ Welcome"]),
      tagline_lines: L(["your neighborhood Best Smoke Shop", "Newest Vapes, Glass, Hookah & More", "Locally Owned", "Reserve Online · Pick Up In-Store", "New Drops Weekly", "21+ Welcome"]),
      home_hero_kicker: "Your Neighborhood Smoke Shop",
      home_hero_sub: "The newest vapes & disposables, glass, hookah, kratom, CBD and more — restocked every week. Come see what's new.",
      welcome_title: "Your One-Stop Smoke Shop",
      welcome_body: "Your one-stop spot for everything you need — the newest disposable vapes, quality glass, hookah & shisha, CBD & hemp, kratom, candles and all the accessories, at prices that keep you coming back.",
      sec_cats_title: "Something for every setup",
      sec_products_title: "Fresh drops & bestsellers",
      sec_blog_title: "Latest drops & reads",
      footer_blurb: "Your neighborhood's favorite smoke shop — the newest vapes, glass, hookah, kratom, CBD & lifestyle gear.",
      careers_intro: "Love the vibe? Come work at your neighborhood favorite smoke shop. Friendly team, flexible shifts, and employee discounts.",
      chat_suggestions: L(["What are your hours?", "What vapes do you have?", "Where are you located?"]),
      ai_persona: "friendly, casual and upbeat, with an occasional 🔥",
    },
    hidden: [],
  },
  food: {
    label: "Café / bakery / food & beverage",
    age_gate: "",
    content: {
      banner_lines: L(["★★★★★ Loved by Locals", "Fresh Every Morning", "Order Ahead · Pick Up In-Store", "New Specials Weekly", "Locally Owned"]),
      tagline_lines: L(["Fresh Every Morning", "Locally Owned", "Order Ahead · Pick Up In-Store", "New Specials Weekly"]),
      home_hero_kicker: "Your Neighborhood Café",
      home_hero_sub: "Fresh-made every day — coffee, pastries and lunch worth the trip. Come see what's on the board this week.",
      hero_cta_shop: "See the menu",
      welcome_title: "Made Fresh, Served Friendly",
      welcome_body: "We bake and brew every morning with ingredients we'd feed our own families. Grab a table, order ahead for pickup, or let us cater your next thing.",
      welcome_cta_shop: "See the menu",
      sec_inside_link: "See the menu →",
      sec_cats_kicker: "On the menu",
      sec_cats_title: "Something for every craving",
      sec_vip_kicker: "Rewards",
      sec_vip_title: "Join the rewards list",
      sec_vip_body: "Be first to hear about new specials, seasonal drinks and members-only treats. No spam — just the good stuff.",
      why_items: L(["Fresh daily | Baked and brewed every morning — nothing sits overnight.", "Locally owned | Neighborhood café, staff who know your order.", "Order ahead | Skip the line — order online, pick up in store."]),
      sec_products_kicker: "From the kitchen",
      sec_products_title: "Specials & favorites",
      sec_products_link: "Full menu →",
      sec_merch_kicker: "Behind the counter",
      sec_merch_title: "See how it's made",
      sec_merch_body: "A peek at the morning bake and the people behind it.",
      sec_merch_cta_ask: "Ask about catering",
      sec_merch_cta_shop: "See the menu",
      sec_reviews_title: "What regulars say",
      sec_blog_title: "News & seasonal specials",
      footer_blurb: "Your neighborhood café — fresh food, real coffee, friendly faces.",
      careers_intro: "Love good food and good people? Come work with us. Friendly team, flexible shifts, free coffee.",
      careers_positions: L(["Barista", "Line Cook", "Baker", "Front of House"]),
      chat_suggestions: L(["What are your hours?", "Do you have gluten-free options?", "Can I order ahead?"]),
      chat_greeting: "Hey! Ask me about the menu, hours, allergens or catering.",
    },
    hidden: [],
  },
  service: {
    label: "Barber / salon / studio / detailing",
    age_gate: "",
    content: {
      banner_lines: L(["★★★★★ Loved by Locals", "Walk-ins Welcome", "Book Online · Skip the Wait", "Locally Owned"]),
      tagline_lines: L(["Walk-ins Welcome", "Book Online · Skip the Wait", "Locally Owned"]),
      home_hero_kicker: "Your Neighborhood Shop",
      home_hero_sub: "Skilled hands, fair prices, no attitude. Book a slot or just walk in.",
      hero_cta_shop: "See services",
      welcome_title: "Look Good, Feel Good",
      welcome_body: "We've been taking care of the neighborhood for years — quality work, clean space, people who remember your name.",
      welcome_cta_shop: "See services",
      sec_inside_link: "See services →",
      sec_cats_kicker: "Services",
      sec_cats_title: "Something for everyone",
      sec_vip_kicker: "Members",
      sec_vip_title: "Join the list",
      sec_vip_body: "First dibs on openings, seasonal deals and members-only perks.",
      why_items: L(["Skilled team | Years of experience, always learning.", "Locally owned | Neighborhood shop, staff who know you.", "Book online | Pick your time, skip the wait."]),
      sec_products_kicker: "Services",
      sec_products_title: "Popular services",
      sec_products_link: "All services →",
      sec_merch_kicker: "In the chair",
      sec_merch_title: "See the work",
      sec_merch_body: "A look at what we do and how we do it.",
      sec_merch_cta_ask: "Ask a question",
      sec_merch_cta_shop: "See services",
      sec_reviews_title: "What clients say",
      footer_blurb: "Your neighborhood shop — quality work, fair prices, friendly faces.",
      careers_intro: "Talented and reliable? We're always looking. Friendly team, flexible schedule, great clients.",
      careers_positions: L(["Stylist / Barber", "Front Desk", "Apprentice"]),
      chat_suggestions: L(["What are your hours?", "How much is a cut?", "Can I book online?"]),
      chat_greeting: "Hey! Ask me about services, prices, hours or booking.",
    },
    hidden: [],
  },
};
