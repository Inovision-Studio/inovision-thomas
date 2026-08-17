import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { lines, text } from "@/lib/content";
import { bizName } from "@/lib/brand";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const s = await getSettings().catch(() => ({}) as Record<string, string>);
  const address = s.address || "44811 Hayes Rd,  48313";
  const phone = s.phone || "";
  const mapsUrl = s.maps_url?.startsWith("http")
    ? s.maps_url
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || bizName(s))}`;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="font-display text-lg text-[color:var(--accent)]">About</p>
        <h1 className="max-w-3xl font-display text-6xl leading-[0.95] md:text-7xl">
          {text(s, "about_title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)] whitespace-pre-line">{text(s, "about_body")}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {lines(s, "why_items").map((row) => row.split("|").map((x) => x.trim())).map(([t, d]) => (
            <div key={t} className="card p-6">
              <h2 className="font-display text-2xl text-[color:var(--accent)]">{t}</h2>
              <p className="mt-2 text-[color:var(--muted)]">{d}</p>
            </div>
          ))}
        </div>

        <div className="card mt-10 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="font-display text-3xl">Find us</h2>
            <p className="mt-1 text-[color:var(--muted)]">{address}</p>
            {phone ? <p className="text-[color:var(--muted)]">{phone}</p> : null}
          </div>
          <div className="flex gap-3">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-[0.6rem] font-semibold hover:border-[color:var(--accent)]/50">
              Get directions
            </a>
            <Link href="/shop" className="btn-accent">Shop the catalog</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
