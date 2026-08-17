import { PageHeader } from "@/components/admin/ui";
import ResetButton from "@/components/admin/ResetButton";
import { getSettings } from "@/lib/settings";
import ThemeEditor from "./ThemeEditor";
import FontPicker from "./FontPicker";
import BrandForm from "./BrandForm";

export const dynamic = "force-dynamic";

const TABS = [
  ["#colors", "Colors"],
  ["#fonts", "Fonts"],
  ["#brand", "Logo & favicon"],
] as const;

export default async function ThemePage() {
  const s = await getSettings();
  const accent = s.accent_color || "#ff5a1f";
  return (
    <div>
      <PageHeader title="Appearance" sub="Colors, fonts, logo and favicon for the whole site" action={<ResetButton scope="theme" />} />
      <nav className="mb-4 flex flex-wrap gap-2 text-sm">
        {TABS.map(([href, label]) => (
          <a key={href} href={href} className="rounded-full border border-white/15 px-3 py-1 hover:bg-white/5">
            {label}
          </a>
        ))}
      </nav>
      <section id="colors">
        <ThemeEditor initial={accent} />
      </section>
      <section id="fonts" className="mt-10">
        <h2 className="mb-3 font-display text-2xl">Fonts</h2>
        <FontPicker initialDisplay={s.font_display ?? ""} initialBody={s.font_body ?? ""} accent={accent} />
      </section>
      <section id="brand" className="mt-10">
        <h2 className="mb-3 font-display text-2xl">Logo &amp; favicon</h2>
        <BrandForm initialLogo={s.logo_ref ?? ""} initialFavicon={s.favicon_ref ?? ""} />
      </section>
    </div>
  );
}
