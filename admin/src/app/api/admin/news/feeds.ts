// ponytail: feeds hardcoded; move to a Setting row when someone actually needs to edit them
export const FEEDS = [
  { source: "Restaurant Business", url: "https://feeds.feedburner.com/RestaurantBusiness" },
  { source: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/" },
  { source: "CSS-Tricks", url: "https://css-tricks.com/feed/" },
];
export const MAX_ITEMS = 60;

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1].trim() : "";
};
const unwrap = (s: string) =>
  s.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();

type Item = { title: string; link: string; summary: string; image: string; publishedAt: Date | null };

export function parseFeed(xml: string): Item[] {
  const chunks = xml.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi) ?? [];
  const items: Item[] = [];
  for (const c of chunks) {
    // Atom: <link href="..."/> ; RSS: <link>...</link>
    const link = unwrap(c.match(/<link[^>]*?href="([^"]+)"/i)?.[1] ?? tag(c, "link"));
    if (!/^https?:\/\//.test(link)) continue;
    const dateRaw = tag(c, "pubDate") || tag(c, "published") || tag(c, "updated") || tag(c, "dc:date");
    const d = dateRaw ? new Date(dateRaw) : null;
    const image = c.match(/<(?:media:content|media:thumbnail|enclosure)[^>]*?url="([^"]+)"/i)?.[1] ?? "";
    items.push({
      title: unwrap(tag(c, "title")).slice(0, 300) || "(untitled)",
      link: link.slice(0, 2000),
      summary: unwrap(tag(c, "description") || tag(c, "summary") || tag(c, "content")).slice(0, 500),
      image: /^https?:\/\//.test(image) ? image.slice(0, 2000) : "",
      publishedAt: d && !isNaN(d.getTime()) ? d : null,
    });
  }
  return items;
}

