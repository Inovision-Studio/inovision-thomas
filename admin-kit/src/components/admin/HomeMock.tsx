/**
 * Miniature of the homepage used by the Colors & Fonts page so a choice can be
 * judged in context. Pure presentational; accent/fonts arrive as props so it
 * never depends on what's saved.
 */
export const MOCK_BUTTON_TEXT = "#04120a";
export const MOCK_PAGE_BG = "#0a0e0a";

export default function HomeMock({
  accent,
  fontDisplay,
  fontBody,
}: {
  accent: string;
  /** CSS font-family values (already quoted where needed) or undefined for site default */
  fontDisplay?: string;
  fontBody?: string;
}) {
  const display = fontDisplay ? { fontFamily: fontDisplay } : undefined;
  const bodyF = fontBody ? { fontFamily: fontBody } : undefined;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10" style={{ background: MOCK_PAGE_BG, ...bodyF }}>
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" className="h-6 w-auto object-contain" />
        <div className="flex gap-3 text-[10px] text-white/60">
          <span>Home</span>
          <span>Shop</span>
          <span>Blog</span>
          <span>Contact</span>
        </div>
      </div>

      <div className="px-4 py-1.5 text-center text-[10px] font-bold uppercase tracking-wide" style={{ background: accent, color: MOCK_BUTTON_TEXT }}>
        ★★★★★ Loved by Locals ✦ New Drops Weekly ✦ 21+ Welcome
      </div>

      <div className="relative h-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to top, ${MOCK_PAGE_BG}, transparent)` }} />
      </div>

      <div className="px-4 pb-5 pt-1 text-center">
        <p className="font-display text-[11px] tracking-wide" style={{ color: accent, ...display }}>
          Your Neighborhood Smoke Shop
        </p>
        <span
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
          style={{ color: accent, borderColor: `${accent}66`, background: `${accent}1a` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          Open · until 12 AM
        </span>
        <h3 className="mt-2 font-display text-3xl leading-none" style={display}>
          Your Store.
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-[11px] text-white/70">The newest vapes, glass, hookah, kratom &amp; CBD — restocked every week.</p>
        <div className="mt-3 flex justify-center gap-2">
          <span className="rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: accent, color: MOCK_BUTTON_TEXT }}>
            Shop the catalog
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-white/80">Get directions</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-white/10 p-3">
        {["$27.99", "$24.99", "$12.00"].map((price, i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <div className="h-10 rounded bg-white/5" />
            <div className="mt-1.5 h-1.5 w-4/5 rounded bg-white/15" />
            <div className="mt-1 font-display text-sm" style={{ color: accent, ...display }}>
              {price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
