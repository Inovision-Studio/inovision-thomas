import{readFileSync as _rf,existsSync as _ex}from"node:fs";import{fileURLToPath as _fu}from"node:url";import{dirname as _dn,join as _jn}from"node:path";try{const _d=_dn(_fu(import.meta.url)),_p=_jn(_d,"../../.env");if(_ex(_p)){_rf(_p,"utf8").split(/\r?\n/).forEach(l=>{const m=l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);if(m)process.env[m[1]]=m[2].replace(/^["\x27]|["\x27]$/g,"");});}}catch(e){}
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D7OZcQKo.mjs';
import { manifest } from './manifest_CYiEkzFl.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin/analytics.astro.mjs');
const _page4 = () => import('./pages/admin/applications.astro.mjs');
const _page5 = () => import('./pages/admin/business.astro.mjs');
const _page6 = () => import('./pages/admin/copy.astro.mjs');
const _page7 = () => import('./pages/admin/editor.astro.mjs');
const _page8 = () => import('./pages/admin/gallery.astro.mjs');
const _page9 = () => import('./pages/admin/image.astro.mjs');
const _page10 = () => import('./pages/admin/inbox.astro.mjs');
const _page11 = () => import('./pages/admin/login.astro.mjs');
const _page12 = () => import('./pages/admin/mockup.astro.mjs');
const _page13 = () => import('./pages/admin/posts/new.astro.mjs');
const _page14 = () => import('./pages/admin/posts/_id_/edit.astro.mjs');
const _page15 = () => import('./pages/admin/posts.astro.mjs');
const _page16 = () => import('./pages/admin/security.astro.mjs');
const _page17 = () => import('./pages/admin/seo.astro.mjs');
const _page18 = () => import('./pages/admin/studio.astro.mjs');
const _page19 = () => import('./pages/admin/team.astro.mjs');
const _page19b = () => import('./pages/admin/team-members.astro.mjs');
const _page20 = () => import('./pages/admin.astro.mjs');
const _page21 = () => import('./pages/api/admin/applications.astro.mjs');
const _page22 = () => import('./pages/api/admin/audit-items.astro.mjs');
const _page23 = () => import('./pages/api/admin/audits.astro.mjs');
const _page24 = () => import('./pages/api/admin/client-note.astro.mjs');
const _page25 = () => import('./pages/api/admin/client-stage.astro.mjs');
const _page26 = () => import('./pages/api/admin/clients.astro.mjs');
const _page27 = () => import('./pages/api/admin/deployments.astro.mjs');
const _page28 = () => import('./pages/api/admin/domain-lookup.astro.mjs');
const _page29 = () => import('./pages/api/admin/gallery.astro.mjs');
const _page30 = () => import('./pages/api/admin/generate.astro.mjs');
const _page31 = () => import('./pages/api/admin/hosting.astro.mjs');
const _page32 = () => import('./pages/api/admin/hosting-sync.astro.mjs');
const _page33 = () => import('./pages/api/admin/hubspot.astro.mjs');
const _page34 = () => import('./pages/api/admin/image.astro.mjs');
const _page35 = () => import('./pages/api/admin/image-edit.astro.mjs');
const _page36 = () => import('./pages/api/admin/invoice-email.astro.mjs');
const _page37 = () => import('./pages/api/admin/invoice-pdf.astro.mjs');
const _page38 = () => import('./pages/api/admin/invoices.astro.mjs');
const _page39 = () => import('./pages/api/admin/keywords.astro.mjs');
const _page40 = () => import('./pages/api/admin/ledger.astro.mjs');
const _page41 = () => import('./pages/api/admin/ledger-import.astro.mjs');
const _page42 = () => import('./pages/api/admin/me.astro.mjs');
const _page43 = () => import('./pages/api/admin/media.astro.mjs');
const _page44 = () => import('./pages/api/admin/messages/_id_.astro.mjs');
const _page45 = () => import('./pages/api/admin/messages.astro.mjs');
const _page46 = () => import('./pages/api/admin/milestones.astro.mjs');
const _page47 = () => import('./pages/api/admin/mockups.astro.mjs');
const _page48 = () => import('./pages/api/admin/password.astro.mjs');
const _page49 = () => import('./pages/api/admin/posts/_id_.astro.mjs');
const _page50 = () => import('./pages/api/admin/posts.astro.mjs');
const _page51 = () => import('./pages/api/admin/project-post.astro.mjs');
const _page52 = () => import('./pages/api/admin/projects.astro.mjs');
const _page53 = () => import('./pages/api/admin/resume.astro.mjs');
const _page54 = () => import('./pages/api/admin/save-image.astro.mjs');
const _page55 = () => import('./pages/api/admin/seo-audit.astro.mjs');
const _page56 = () => import('./pages/api/admin/settings.astro.mjs');
const _page57 = () => import('./pages/api/admin/stripe.astro.mjs');
const _page58 = () => import('./pages/api/admin/system.astro.mjs');
const _page59 = () => import('./pages/api/admin/team.astro.mjs');
const _page59b = () => import('./pages/api/admin/team-members.astro.mjs');
const _page60 = () => import('./pages/api/admin/upload.astro.mjs');
const _page61 = () => import('./pages/api/apply.astro.mjs');
const _page62 = () => import('./pages/api/auth/login.astro.mjs');
const _page63 = () => import('./pages/api/auth/logout.astro.mjs');
const _page64 = () => import('./pages/api/contact.astro.mjs');
const _page65 = () => import('./pages/api/news/refresh.astro.mjs');
const _page66 = () => import('./pages/api/onboard/return.astro.mjs');
const _page67 = () => import('./pages/api/onboard.astro.mjs');
const _page68 = () => import('./pages/api/pay.astro.mjs');
const _page69 = () => import('./pages/api/portal/login.astro.mjs');
const _page70 = () => import('./pages/api/portal/logout.astro.mjs');
const _page71 = () => import('./pages/api/portal/messages.astro.mjs');
const _page72 = () => import('./pages/api/portal/pay-deposit.astro.mjs');
const _page73 = () => import('./pages/api/portal/subscribe.astro.mjs');
const _page74 = () => import('./pages/api/stripe-webhook.astro.mjs');
const _page75 = () => import('./pages/blog/_slug_.astro.mjs');
const _page76 = () => import('./pages/blog.astro.mjs');
const _page77 = () => import('./pages/careers.astro.mjs');
const _page78 = () => import('./pages/contact.astro.mjs');
const _page79 = () => import('./pages/faq.astro.mjs');
const _page80 = () => import('./pages/invoice/_token_.astro.mjs');
const _page81 = () => import('./pages/media/_name_.astro.mjs');
const _page82 = () => import('./pages/news.astro.mjs');
const _page83 = () => import('./pages/portal.astro.mjs');
const _page84 = () => import('./pages/pricing.astro.mjs');
const _page85 = () => import('./pages/privacy.astro.mjs');
const _page86 = () => import('./pages/sitemap.xml.astro.mjs');
const _page87 = () => import('./pages/start.astro.mjs');
const _page88 = () => import('./pages/terms.astro.mjs');
const _page89 = () => import('./pages/work.astro.mjs');
const _page90 = () => import('./pages/index.astro.mjs');
const _page91 = () => import('./pages/team.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/analytics.astro", _page3],
    ["src/pages/admin/applications.astro", _page4],
    ["src/pages/admin/business.astro", _page5],
    ["src/pages/admin/copy.astro", _page6],
    ["src/pages/admin/editor.astro", _page7],
    ["src/pages/admin/gallery.astro", _page8],
    ["src/pages/admin/image.astro", _page9],
    ["src/pages/admin/inbox.astro", _page10],
    ["src/pages/admin/login.astro", _page11],
    ["src/pages/admin/mockup.astro", _page12],
    ["src/pages/admin/posts/new.astro", _page13],
    ["src/pages/admin/posts/[id]/edit.astro", _page14],
    ["src/pages/admin/posts/index.astro", _page15],
    ["src/pages/admin/security.astro", _page16],
    ["src/pages/admin/seo.astro", _page17],
    ["src/pages/admin/studio.astro", _page18],
    ["src/pages/admin/team.astro", _page19],
    ["src/pages/admin/team-members.astro", _page19b],
    ["src/pages/admin/index.astro", _page20],
    ["src/pages/api/admin/applications.ts", _page21],
    ["src/pages/api/admin/audit-items.ts", _page22],
    ["src/pages/api/admin/audits.ts", _page23],
    ["src/pages/api/admin/client-note.ts", _page24],
    ["src/pages/api/admin/client-stage.ts", _page25],
    ["src/pages/api/admin/clients.ts", _page26],
    ["src/pages/api/admin/deployments.ts", _page27],
    ["src/pages/api/admin/domain-lookup.ts", _page28],
    ["src/pages/api/admin/gallery.ts", _page29],
    ["src/pages/api/admin/generate.ts", _page30],
    ["src/pages/api/admin/hosting.ts", _page31],
    ["src/pages/api/admin/hosting-sync.ts", _page32],
    ["src/pages/api/admin/hubspot.ts", _page33],
    ["src/pages/api/admin/image.ts", _page34],
    ["src/pages/api/admin/image-edit.ts", _page35],
    ["src/pages/api/admin/invoice-email.ts", _page36],
    ["src/pages/api/admin/invoice-pdf.ts", _page37],
    ["src/pages/api/admin/invoices.ts", _page38],
    ["src/pages/api/admin/keywords.ts", _page39],
    ["src/pages/api/admin/ledger.ts", _page40],
    ["src/pages/api/admin/ledger-import.ts", _page41],
    ["src/pages/api/admin/me.ts", _page42],
    ["src/pages/api/admin/media.ts", _page43],
    ["src/pages/api/admin/messages/[id].ts", _page44],
    ["src/pages/api/admin/messages.ts", _page45],
    ["src/pages/api/admin/milestones.ts", _page46],
    ["src/pages/api/admin/mockups.ts", _page47],
    ["src/pages/api/admin/password.ts", _page48],
    ["src/pages/api/admin/posts/[id].ts", _page49],
    ["src/pages/api/admin/posts.ts", _page50],
    ["src/pages/api/admin/project-post.ts", _page51],
    ["src/pages/api/admin/projects.ts", _page52],
    ["src/pages/api/admin/resume.ts", _page53],
    ["src/pages/api/admin/save-image.ts", _page54],
    ["src/pages/api/admin/seo-audit.ts", _page55],
    ["src/pages/api/admin/settings.ts", _page56],
    ["src/pages/api/admin/stripe.ts", _page57],
    ["src/pages/api/admin/system.ts", _page58],
    ["src/pages/api/admin/team.ts", _page59],
    ["src/pages/api/admin/team-members.ts", _page59b],
    ["src/pages/api/admin/upload.ts", _page60],
    ["src/pages/api/apply.ts", _page61],
    ["src/pages/api/auth/login.ts", _page62],
    ["src/pages/api/auth/logout.ts", _page63],
    ["src/pages/api/contact.ts", _page64],
    ["src/pages/api/news/refresh.ts", _page65],
    ["src/pages/api/onboard/return.ts", _page66],
    ["src/pages/api/onboard.ts", _page67],
    ["src/pages/api/pay.ts", _page68],
    ["src/pages/api/portal/login.ts", _page69],
    ["src/pages/api/portal/logout.ts", _page70],
    ["src/pages/api/portal/messages.ts", _page71],
    ["src/pages/api/portal/pay-deposit.ts", _page72],
    ["src/pages/api/portal/subscribe.ts", _page73],
    ["src/pages/api/stripe-webhook.ts", _page74],
    ["src/pages/blog/[slug].astro", _page75],
    ["src/pages/blog/index.astro", _page76],
    ["src/pages/careers.astro", _page77],
    ["src/pages/contact.astro", _page78],
    ["src/pages/faq.astro", _page79],
    ["src/pages/invoice/[token].astro", _page80],
    ["src/pages/media/[name].ts", _page81],
    ["src/pages/news.astro", _page82],
    ["src/pages/portal/index.astro", _page83],
    ["src/pages/pricing.astro", _page84],
    ["src/pages/privacy.astro", _page85],
    ["src/pages/sitemap.xml.ts", _page86],
    ["src/pages/start.astro", _page87],
    ["src/pages/terms.astro", _page88],
    ["src/pages/work.astro", _page89],
    ["src/pages/index.astro", _page90],
    ["src/pages/team.astro", _page91]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///D:/wix/Inovision/web/dist/client/",
    "server": "file:///D:/wix/Inovision/web/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_assets",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
