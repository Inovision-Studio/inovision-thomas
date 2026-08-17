import { getSettings } from "@/lib/settings";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import ApplyForm from "@/components/public/ApplyForm";
import { text, lines } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const s = await getSettings().catch(() => ({}) as Record<string, string>);
  const POSITIONS = lines(s, "careers_positions");
  const phone = s.phone || "";
  const tel = phone.replace(/[^\d+]/g, "");
  const address = s.address || "";

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="font-display text-lg text-[color:var(--accent)]">We&apos;re hiring</p>
        <h1 className="font-display text-6xl">{text(s, "careers_title")}</h1>
        <p className="mt-4 text-lg text-[color:var(--muted)]">
          {text(s, "careers_intro")}
        </p>

        <div className="card mt-8 p-6">
          <h2 className="font-display text-2xl">Open positions</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {POSITIONS.map((p) => (
              <li key={p} className="rounded-full border border-white/15 px-3 py-1 text-sm text-[color:var(--muted)]">
                {p}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-display text-2xl">How to apply</h2>
          <p className="mt-2 text-[color:var(--muted)]">
            Fill this out and it lands straight with the owner — takes about two minutes.
          </p>
          <ApplyForm positions={POSITIONS} />
          <p className="mt-6 text-sm text-[color:var(--muted)]">Prefer to talk? Reach us directly:</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {phone ? (
              <>
                <a href={`tel:${tel}`} className="btn-accent">Call {phone}</a>
                <a href={`sms:${tel}`} className="rounded-full border border-white/15 px-5 py-[0.6rem] font-semibold hover:border-[color:var(--accent)]/50">
                  Text us
                </a>
              </>
            ) : null}
          </div>
          <p className="mt-6 text-sm text-[color:var(--muted)]">
            {address ? `You can also apply in person at ${address}. ` : ""}{text(s, "careers_footer")}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
