import Link from "next/link";
import { db } from "@/lib/db";
import Nav from "./Nav";
import Footer from "./Footer";
import { sized, srcSet } from "@/lib/img";

/** Shared listing used by both /blog and /news (News == blog). */
export default async function BlogList({ kicker, title }: { kicker: string; title: string }) {
  const posts = await db.blogPost
    .findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } })
    .catch(() => []);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="font-display text-lg text-[color:var(--accent)]">{kicker}</p>
        <h1 className="font-display text-6xl">{title}</h1>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card group overflow-hidden">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sized(p.image, 800)} srcSet={srcSet(p.image, 1200)} sizes="(min-width: 768px) 33vw, 100vw" alt={p.title} className="aspect-video w-full object-cover" loading="lazy" />
                ) : null}
                <div className="p-4">
                  <time className="text-xs text-[color:var(--muted)]">
                    {new Date(p.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                  <h2 className="mt-1 line-clamp-3 font-medium leading-snug group-hover:text-[color:var(--accent)]">
                    {p.title}
                  </h2>
                  {p.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-[color:var(--muted)]">{p.excerpt}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-[color:var(--muted)]">No posts yet — check back soon.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
