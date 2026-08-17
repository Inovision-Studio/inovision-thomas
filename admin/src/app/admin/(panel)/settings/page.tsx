import { PageHeader } from "@/components/admin/ui";
import { getSettings } from "@/lib/settings";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="Settings" sub="Business details, SEO defaults, social links, branding and portal copy" />
      <SettingsClient settings={settings} />
    </div>
  );
}
