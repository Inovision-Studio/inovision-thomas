import { ae as deleteProject, af as listProjectUpdates, ag as listProjects, ah as saveProject } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => json({ ok: true, projects: listProjects(), updates: listProjectUpdates() });
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (!b.name?.trim()) return json({ error: "Project name required" }, 400);
  const id = saveProject({ id: b.id, name: b.name.trim(), status: b.status });
  return json({ ok: true, id });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteProject(Number(id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
