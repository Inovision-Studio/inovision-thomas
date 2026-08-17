import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { bizName } from "@/lib/brand";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, s] = await Promise.all([
    db.review.findMany({ orderBy: { sort: "asc" } }).catch(() => []),
    getSettings().catch(() => ({}) as Record<string, string>),
  ]);
  const name = bizName(s);
  const address = s.address || "";
  // Prefer an exact pin over a name search: a search for "<name>" can land the
  // visitor on a different store entirely, which has already happened here.
  const googleUrl = s.google_review_link?.startsWith("http")
    ? s.google_review_link
    : s.maps_url?.startsWith("http")
      ? s.maps_url
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || name)}`;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="font-display text-lg text-[color:var(--accent)]">★★★★★ Loved by Locals</p>
        <h1 className="font-display text-6xl">Reviews</h1>

        <div className="card mt-8 p-8 text-center">
          <p className="text-[color:var(--accent)]">★★★★★</p>
          <p className="mt-2 font-display text-3xl">We strive for 5-star service</p>
          <p className="mx-auto mt-2 max-w-lg text-[color:var(--muted)]">
            Loved your visit to {name}? It takes 10 seconds to tell Google, and it helps a local shop more than you know.
          </p>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="btn-accent mt-5">
            Leave a Google review →
          </a>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.id} className="card p-5">
                <div className="text-[color:var(--accent)]">{"★".repeat(r.stars)}</div>
                <blockquote className="mt-2 text-[color:var(--muted)]">{r.text}</blockquote>
                <figcaption className="mt-3 font-medium">— {r.name}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-[color:var(--muted)]">
            Be the first to leave a review — we&apos;d love your feedback.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
