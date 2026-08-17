import { PageHeader, Card, inputClass } from "@/components/admin/ui";
import ResetButton from "@/components/admin/ResetButton";
import { getSettings } from "@/lib/settings";
import { saveSettings } from "./actions";
import PasswordCard from "./PasswordCard";

export const dynamic = "force-dynamic";

const NOTE = "The dashboard already tracks visits, taps, spins and signups on its own. Add a GA4 ID only if you also want Google's reports.";

type Field = { key: string; label: string; options?: [string, string][] };
type Group = { title: string; note?: boolean; fields: Field[] };

const GROUPS: Group[] = [
  {
    title: "Business info",
    fields: [
      { key: "business_name", label: "Business name" },
      { key: "business_blurb", label: "One-line description (used by AI + search engines)" },
      { key: "phone", label: "Phone (shows Call buttons when set)" },
      { key: "address", label: "Street address" },
      { key: "maps_url", label: "Google Maps share link (exact pin)" },
    ],
  },
  {
    title: "Age gate",
    fields: [
      { key: "age_gate", label: "Ask visitors to confirm their age", options: [["", "Off"], ["18", "18+"], ["21", "21+"]] },
    ],
  },
  {
    title: "Social Links",
    fields: [
      { key: "instagram", label: "Instagram URL" },
      { key: "facebook", label: "Facebook URL" },
    ],
  },
  {
    title: "Google Analytics (optional)",
    note: true,
    fields: [{ key: "ga_measurement_id", label: "Measurement ID (G-XXXX)" }],
  },
  { title: "Google Reviews", fields: [{ key: "google_review_link", label: "Review link" }] },
];

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <div>
      <PageHeader title="Settings & Connectors" sub="Keys and integrations (stored only)" action={<ResetButton scope="all" label="Reset all to original" />} />

      <Card>
        <h2 className="mb-1 font-display text-xl">AI (Gemini)</h2>
        <p className="text-sm text-white/60">
          Chat and blog AI use the server&apos;s <code className="text-white/80">GEMINI_API_KEY</code>.{" "}
          {process.env.GEMINI_API_KEY ? (
            <span className="text-green-400">Configured ✓</span>
          ) : (
            <span className="text-amber-300">Not set — add it in the Vercel project environment.</span>
          )}
        </p>
      </Card>

      <form action={saveSettings} className="mt-5 grid gap-5">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <h2 className="mb-1 font-display text-xl">{g.title}</h2>
            {g.note && <p className="mb-3 text-sm text-amber-300/80">{NOTE}</p>}
            <div className="grid gap-3 md:grid-cols-2">
              {g.fields.map((f) => (
                <label key={f.key} className="grid gap-1">
                  <span className="text-sm text-white/80">{f.label}</span>
                  {f.options ? (
                    <select name={f.key} defaultValue={s[f.key] ?? ""} className={inputClass}>
                      {f.options.map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  ) : (
                    <input name={f.key} defaultValue={s[f.key] ?? ""} className={inputClass} />
                  )}
                </label>
              ))}
            </div>
          </Card>
        ))}
        <div>
          <button type="submit" className="btn-accent text-sm">Save settings</button>
        </div>
      </form>

      <div className="mt-6">
        <PasswordCard />
      </div>
    </div>
  );
}
