import Parser from 'rss-parser';
import { aq as upsertNews, ar as pruneNews } from './db_xJ927fmw.mjs';

const FEEDS = [
  { source: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
  { source: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { source: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
  { source: "MIT Tech Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/" },
  { source: "Ars Technica AI", url: "https://arstechnica.com/ai/feed/" },
  { source: "Google AI Blog", url: "https://blog.google/technology/ai/rss/" }
];
const parser = new Parser({
  timeout: 12e3,
  headers: {
    "User-Agent": "InovisionStudiosNewsBot/1.0 (+https://inovisionstudios.com)"
  }
});
function snippet(s, max = 220) {
  if (!s) return null;
  const t = s.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, "") + "…" : t;
}
function firstImage(it) {
  const enc = it.enclosure;
  if (enc?.url) return enc.url;
  const media = it["media:content"];
  if (media?.$?.url) return media.$.url;
  const content = it.content || it["content:encoded"] || "";
  const m = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
async function refreshNews(perFeed = 8) {
  const results = await Promise.allSettled(
    FEEDS.map((f) => parser.parseURL(f.url).then((feed) => ({ f, feed })))
  );
  let total = 0;
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const { f, feed } = r.value;
    const items = (feed.items || []).slice(0, perFeed).map((it) => ({
      source: f.source,
      title: (it.title || "").trim(),
      link: (it.link || "").trim(),
      summary: snippet(it.contentSnippet || it.summary || it.content),
      image: firstImage(it),
      published_at: it.isoDate ? Date.parse(it.isoDate) : it.pubDate ? Date.parse(it.pubDate) : null
    })).filter((x) => x.title && x.link);
    if (items.length) total += upsertNews(items);
  }
  pruneNews(80);
  return total;
}

export { refreshNews as r };
