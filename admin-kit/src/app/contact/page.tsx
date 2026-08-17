import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { bizName } from "@/lib/brand";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import OpenStatus from "@/components/public/OpenStatus";
import { DAYS } from "@/components/public/util";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [s, hours] = await Promise.all([
    getSettings().catch(() => ({}) as Record<string, string>),
    db.businessHour.findMany({ orderBy: { day: "asc" } }).catch(() => []),
  ]);
  const address = s.address || "44811 Hayes Rd,  48313";
  const phone = s.phone || "";
  const tel = phone.replace(/[^\d+]/g, "");
  const mapsUrl = s.maps_url?.startsWith("http")
    ? s.maps_url
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || bizName(s))}`;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="font-display text-lg text-[color:var(--accent)]">Get in touch</p>
        <h1 className="font-display text-6xl">Contact &amp; Visit</h1>
        <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
          Stop in, call, or text — we&apos;ll hold anything you see online for in-store pickup.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <OpenStatus />
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-sm text-[color:var(--muted)]">📍 Address</dt>
                <dd>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--accent)]">
                    {address}
                  </a>
                </dd>
              </div>
              {phone ? (
                <div>
                  <dt className="text-sm text-[color:var(--muted)]">📞 Phone</dt>
                  <dd>
                    <a href={`tel:${tel}`} className="hover:text-[color:var(--accent)]">{phone}</a>
                  </dd>
                </div>
              ) : null}
              {(s.instagram || s.facebook) && (
                <div>
                  <dt className="text-sm text-[color:var(--muted)]">📷 Follow</dt>
                  <dd className="flex gap-3">
                    {s.instagram ? <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--accent)]">Instagram</a> : null}
                    {s.facebook ? <a href={s.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--accent)]">Facebook</a> : null}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-6 flex gap-3">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-[0.6rem] font-semibold hover:border-[color:var(--accent)]/50">
                Get directions
              </a>
              {phone ? <a href={`tel:${tel}`} className="btn-accent">Call us</a> : null}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-3xl">Store Hours</h2>
            <table className="mt-4 w-full">
              <tbody>
                {hours.map((h) => (
                  <tr key={h.day} className="border-b border-white/5 last:border-0">
                    <td className="py-2">{DAYS[h.day]}</td>
                    <td className="py-2 text-right tabular-nums text-[color:var(--muted)]">
                      {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
