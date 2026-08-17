import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  const t = await p.$queryRawUnsafe<{ tablename: string }[]>("select tablename from pg_tables where schemaname='public'");
  console.log("tables:", t.length, "settings:", await p.setting.count(), "hours:", await p.businessHour.count(), "migrations:", await p.$queryRawUnsafe<any[]>('select count(*)::int as n from _prisma_migrations').then(r=>r[0].n).catch(()=> 'none'));
})().finally(() => p.$disconnect());
