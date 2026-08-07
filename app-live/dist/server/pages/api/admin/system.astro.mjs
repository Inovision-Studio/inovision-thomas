import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
function dirSize(dir, depth = 0) {
  if (depth > 6) return 0;
  let total = 0;
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      try {
        total += e.isDirectory() ? dirSize(p, depth + 1) : fs.statSync(p).size;
      } catch {
      }
    }
  } catch {
  }
  return total;
}
const GET = () => {
  const cpus = os.cpus();
  let disk = null;
  try {
    const s = fs.statfsSync(process.cwd());
    const total = s.blocks * s.bsize;
    const free = s.bavail * s.bsize;
    disk = { total, free, used: total - free };
  } catch {
  }
  return json({
    ok: true,
    mem: { total: os.totalmem(), free: os.freemem(), used: os.totalmem() - os.freemem(), rss: process.memoryUsage().rss },
    cpu: { cores: cpus.length, model: (cpus[0]?.model || "").trim(), load: os.loadavg() },
    disk,
    app: { footprint: dirSize(path.join(process.cwd(), "data")), uptime: process.uptime(), node: process.version },
    sys: { uptime: os.uptime(), platform: os.platform() + " " + os.arch(), hostname: os.hostname() }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
