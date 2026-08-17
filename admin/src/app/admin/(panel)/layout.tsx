import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  const settings = await getSettings().catch(() => ({}) as Record<string, string>);
  return (
    <AdminShell name={settings.business_name || "Inovision Studios"} siteUrl={settings.site_url || ""} user={{ name: s.name, email: s.email, role: s.role, permissions: s.permissions }}>
      {children}
    </AdminShell>
  );
}
