import { PageHeader, Card, inputClass } from "@/components/admin/ui";
import { getSettings } from "@/lib/settings";
import { CONTENT_FIELDS, CONTENT_DEFAULTS } from "@/lib/content";
import { saveContent } from "./actions";
import SaveBar from "./SaveBar";
import ImageField from "@/components/admin/ImageField";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const s = await getSettings();
  const groups = [...new Set(CONTENT_FIELDS.map((f) => f.group))];

  return (
    <div>
      <PageHeader
        title="Site Content"
        sub="Every heading and blurb on the public site. Leave a field empty to use the original wording."
      />

      <form action={saveContent} className="grid gap-5 pb-24">
        {groups.map((g, gi) => (
          <Card key={g} className="admin-rise" >
            <h2 className="mb-4 font-display text-xl" style={{ ["--i" as string]: gi }}>
              {g}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {CONTENT_FIELDS.filter((f) => f.group === g).map((f) => (
                <label
                  key={f.key}
                  className={`grid gap-1 ${f.type === "text" ? "" : "md:col-span-2"}`}
                >
                  <span className="text-sm text-white/80">{f.label}</span>
                  {f.type === "image" ? (
                    <ImageField name={f.key} initial={s[f.key] ?? ""} label={f.label} />
                  ) : f.type === "text" ? (
                    <input
                      name={f.key}
                      defaultValue={s[f.key] ?? ""}
                      placeholder={CONTENT_DEFAULTS[f.key]}
                      className={inputClass}
                    />
                  ) : (
                    <textarea
                      name={f.key}
                      defaultValue={s[f.key] ?? ""}
                      placeholder={CONTENT_DEFAULTS[f.key]}
                      rows={f.type === "list" ? 6 : 3}
                      className={inputClass}
                    />
                  )}
                  {f.hint ? <span className="text-xs text-white/45">{f.hint}</span> : null}
                </label>
              ))}
            </div>
          </Card>
        ))}

        <SaveBar />
      </form>
    </div>
  );
}
