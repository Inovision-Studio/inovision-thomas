import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import Markdown from "@/components/Markdown";
import { sized, srcSet } from "@/lib/img";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  const post = await db.blogPost.findUnique({ where: { slug } }).catch(() => null);
  return post && post.published ? post : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) return {};
  const description = post.excerpt || post.body.replace(/[#*_>`\[\]()]/g, "").slice(0, 155).trim();
  return {
    title: post.title,
    description,
    openGraph: { title: post.title, description, images: post.image ? [sized(post.image, 1200)] : [] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--text)]">
          ← Back to blog
        </Link>
        <time className="mt-6 block text-sm text-[color:var(--accent)]">
          {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </time>
        <h1 className="mt-2 font-display text-5xl leading-tight md:text-6xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-xl text-[color:var(--muted)]">{post.excerpt}</p> : null}
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sized(post.image, 1600)} srcSet={srcSet(post.image)} sizes="(min-width: 768px) 768px, 100vw" alt={post.title} className="card mt-8 w-full object-cover" />
        ) : null}
        <Markdown className="mt-8">{post.body}</Markdown>
        {post.tags.length > 0 ? (
          <ul className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-[color:var(--muted)]">
                #{t}
              </li>
            ))}
          </ul>
        ) : null}
      </article>
      <Footer />
    </>
  );
}
