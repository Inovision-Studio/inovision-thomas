import type { Metadata } from "next";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import Reveal from "@/components/public/Reveal";
import { getLocations, formatAddress, directionsUrl } from "@/lib/locations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Locations",
  description: "All our locations, with directions and hours.",
};

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="font-display text-lg tracking-wide text-[color:var(--accent)]">Find us</p>
        <h1 className="mt-1 font-display text-[length:var(--text-h2)] leading-tight">
          {locations.length > 0 ? `${locations.length} locations` : "Our locations"}
        </h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
          Same shop, same lineup. Pick whichever one is closest to you.
        </p>

        {locations.length === 0 ? (
          <p className="mt-10 text-[color:var(--muted)]">Locations are being updated — check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {locations.map((l, i) => (
              <Reveal key={l.id} delay={i * 60}>
                <div className="card flex h-full flex-col p-6">
                  <h2 className="font-display text-2xl leading-tight">{l.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                    {formatAddress(l)}
                  </p>
                  {l.hours ? (
                    <p className="mt-2 text-sm text-[color:var(--muted)]">{l.hours}</p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2 pt-1">
                    <a
                      href={directionsUrl(l)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent text-sm"
                    >
                      Directions
                    </a>
                    {l.phone ? (
                      <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="btn-ghost text-sm">
                        Call
                      </a>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
