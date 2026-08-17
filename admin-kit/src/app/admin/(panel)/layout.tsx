import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { getSettings } from "@/lib/settings";
import { bizName } from "@/lib/brand";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s || s.role !== "owner") redirect("/admin/login");
  const settings = await getSettings().catch(() => ({}) as Record<string, string>);
  return <AdminShell name={bizName(settings)}>{children}</AdminShell>;
}
