"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Dialogs";
import ImageField from "@/components/admin/ImageField";

type Field = { key: string; label: string; type?: "text" | "url" | "email" | "tel" | "textarea"; placeholder?: string };
const GROUPS: { title: string; fields: Field[] }[] = [
  { title: "Business", fields: [
    { key: "business_name", label: "Business name", placeholder: "Inovision Studios" },
    { key: "site_url", label: "Site URL", type: "url", placeholder: "https://inovisionstudios.com" },
    { key: "contact_email", label: "Contact email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "address", label: "Address", type: "textarea" },
  ] },
  { title: "SEO defaults", fields: [
    { key: "seo_title", label: "Default title" },
    { key: "seo_description", label: "Default description", type: "textarea" },
  ] },
  { title: "Social", fields: [
    { key: "instagram", label: "Instagram", type: "url" },
    { key: "facebook", label: "Facebook", type: "url" },
    { key: "linkedin", label: "LinkedIn", type: "url" },
    { key: "x_url", label: "X (Twitter)", type: "url" },
  ] },
];
const DEFAULT_ACCENT = "#c8ff00";
const HEX = /^#[0-9a-f]{6}$/i;

async function post(body: unknown) {
  const r = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, error: (j as { error?: string }).error };
}

export default function SettingsClient({ settings }: { settings: Record<string, string> }) {
  const toast = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [accent, setAccent] = useState(settings.accent_color || "");
  const [pwSaving, setPwSaving] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (values.accent_color && !HEX.test(String(values.accent_color))) return toast("Accent colour must look like #c8ff00", "error");
    setSaving(true);
    const r = await post({ action: "save", values });
    setSaving(false);
    if (!r.ok) return toast(r.error || "Could not save", "error");
    toast("Settings saved");
    router.refresh();
  }

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pw.next !== pw.confirm) return toast("New passwords do not match", "error");
    if (pw.next.length < 8) return toast("New password must be at least 8 characters", "error");
    setPwSaving(true);
    const r = await post({ action: "changePassword", current: pw.current, next: pw.next });
    setPwSaving(false);
    if (!r.ok) return toast(r.error || "Could not change password", "error");
    setPw({ current: "", next: "", confirm: "" });
    toast("Password changed");
  }

  const input = (f: Field) => (
    <label key={f.key} className="block text-sm">
      <span className="mb-1 block text-white/60">{f.label}</span>
      {f.type === "textarea"
        ? <textarea name={f.key} defaultValue={settings[f.key] ?? ""} rows={3} className={inputClass} />
        : <input name={f.key} type={f.type ?? "text"} defaultValue={settings[f.key] ?? ""} placeholder={f.placeholder} className={inputClass} />}
    </label>
  );

  return (
    <div className="grid gap-4">
      <form onSubmit={save} className="grid gap-4 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <h2 className="mb-3 font-display text-xl">{g.title}</h2>
            <div className="grid gap-3">
              {g.fields.map(input)}
              {g.title === "SEO defaults" ? <div className="text-sm"><ImageField name="og_image" initial={settings.og_image ?? ""} label="Default share image (og:image)" /></div> : null}
            </div>
          </Card>
        ))}
        <Card>
          <h2 className="mb-3 font-display text-xl">Branding</h2>
          <label className="block text-sm">
            <span className="mb-1 block text-white/60">Accent colour <span className="ml-1 rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/50">coming soon</span></span>
            <div className="flex gap-2">
              <input type="color" value={HEX.test(accent) ? accent : DEFAULT_ACCENT} onChange={(e) => setAccent(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-black/40 p-1" aria-label="Pick accent colour" />
              <input name="accent_color" value={accent} onChange={(e) => setAccent(e.target.value)} placeholder={DEFAULT_ACCENT} className={inputClass} />
            </div>
          </label>
          <p className="mt-2 text-xs text-white/40">Saved for later: the admin does not yet read this at runtime, so changing it will not recolour the panel yet.</p>
        </Card>
        <Card>
          <h2 className="mb-3 font-display text-xl">Portal</h2>
          <label className="block text-sm">
            <span className="mb-1 block text-white/60">Client portal welcome message</span>
            <textarea name="portal_welcome" defaultValue={settings.portal_welcome ?? ""} rows={5} className={inputClass} placeholder="Shown to clients when they sign in to their portal." />
          </label>
        </Card>
        <div className="lg:col-span-2">
          <button type="submit" disabled={saving} className="btn-accent text-sm disabled:opacity-50">{saving ? "Saving…" : "Save settings"}</button>
        </div>
      </form>

      <Card className="lg:max-w-md">
        <h2 className="mb-3 font-display text-xl">Change my password</h2>
        <form onSubmit={changePassword} className="grid gap-3 text-sm">
          <label className="block"><span className="mb-1 block text-white/60">Current password</span><input type="password" autoComplete="current-password" required value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputClass} /></label>
          <label className="block"><span className="mb-1 block text-white/60">New password</span><input type="password" autoComplete="new-password" required minLength={8} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputClass} /></label>
          <label className="block"><span className="mb-1 block text-white/60">Confirm new password</span><input type="password" autoComplete="new-password" required minLength={8} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputClass} /></label>
          <div><button type="submit" disabled={pwSaving} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5 disabled:opacity-50">{pwSaving ? "Changing…" : "Change password"}</button></div>
        </form>
      </Card>
    </div>
  );
}
