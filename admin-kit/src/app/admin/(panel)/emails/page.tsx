import { db } from "@/lib/db";
import { PageHeader, Card, Stat, LinkButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return new Date(d).toLocaleDateString();
}

export default async function EmailsPage() {
  const [vip, subs] = await Promise.all([
    db.vipMember.findMany({ orderBy: { createdAt: "desc" } }),
    db.newsletterSub.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Emails"
        sub="VIP members and newsletter subscribers"
        action={<LinkButton href="/api/admin/emails/export">Export CSV</LinkButton>}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Stat label="VIP MEMBERS" value={vip.length} />
        <Stat label="NEWSLETTER SUBS" value={subs.length} />
        <Stat label="TOTAL" value={vip.length + subs.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-2xl">VIP Members</h2>
          {vip.length === 0 ? (
            <p className="text-sm text-white/50">No VIP members yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-white/50">
                  <tr>
                    <th className="py-2">Email</th>
                    <th className="py-2">Coupon won</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {vip.map((m) => (
                    <tr key={m.id} className="border-t border-white/10">
                      <td className="py-2">{m.email}</td>
                      <td className="py-2 text-white/70">{m.couponWon || "—"}</td>
                      <td className="py-2 text-white/50">{fmt(m.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-2xl">Newsletter Subscribers</h2>
          {subs.length === 0 ? (
            <p className="text-sm text-white/50">No subscribers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-white/50">
                  <tr>
                    <th className="py-2">Email</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s) => (
                    <tr key={s.id} className="border-t border-white/10">
                      <td className="py-2">{s.email}</td>
                      <td className="py-2 text-white/50">{fmt(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
