import { getSettings } from "@/lib/settings";
import { CONTENT_FIELDS } from "@/lib/content";
import { parseLayout } from "@/lib/homeLayout";
import VisualEditor from "./VisualEditor";

export const dynamic = "force-dynamic";

/**
 * Visual editor. Pages are keyed by pathname so About/Careers/Contact can plug
 * in later with their own section registries; only "/" is wired today.
 */
const PAGES: Record<string, { title: string; layoutKey: string }> = {
  "/": { title: "Home", layoutKey: "home_layout" },
};

export default async function EditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const path = sp.page && PAGES[sp.page] ? sp.page : "/";
  const s = await getSettings();
  const content: Record<string, string> = {};
  for (const f of CONTENT_FIELDS) content[f.key] = s[f.key] ?? "";
  return <VisualEditor page={path} title={PAGES[path].title} content={content} layout={parseLayout(s[PAGES[path].layoutKey])} />;
}
