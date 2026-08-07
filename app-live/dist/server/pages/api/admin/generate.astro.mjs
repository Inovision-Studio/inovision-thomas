export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const env = (k) => process.env[k];
const MOCKUP_SYS = `You are Inovision Studios' senior front-end designer. Output ONE complete, self-contained HTML document (inline <style>, no external assets) for a premium, modern marketing site mockup. Anti-slop rules: distinctive type, real whitespace, hairlines over boxes, no generic cards, no pill tags, tasteful motion via CSS only. Dark or light per the brief. If given the current page HTML, EDIT it to satisfy the new request rather than starting over. Return ONLY the HTML, no commentary, no markdown fences.`;
const COPY_SYS = `You are a senior conversion copywriter for a web design studio. Write tight, specific, on-brand copy. Return only the copy requested, no preamble.`;
const strip = (s) => s.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const engine = body.engine || "fast";
  const mode = body.mode === "copy" ? "copy" : "mockup";
  const sys = mode === "copy" ? COPY_SYS : MOCKUP_SYS;
  const maxTokens = mode === "mockup" ? 4e3 : 900;
  const userMsgs = body.messages?.length ? body.messages : [{ role: "user", content: body.prompt || "" }];
  try {
    if (engine === "claude") {
      const key2 = env("ANTHROPIC_API_KEY");
      if (!key2) return json({ needsKey: true, env: "ANTHROPIC_API_KEY" });
      const res2 = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": key2, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
        body: JSON.stringify({
          model: env("ANTHROPIC_MODEL") || "claude-sonnet-4-6",
          max_tokens: maxTokens,
          system: sys,
          messages: userMsgs.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
        }),
        signal: AbortSignal.timeout(12e4)
      });
      const data2 = await res2.json();
      if (!res2.ok) return json({ error: data2?.error?.message || "Claude error", raw: data2 }, 502);
      let out2 = (data2.content || []).map((c) => c.text || "").join("");
      if (mode === "mockup") out2 = strip(out2);
      return json({ ok: true, output: out2 });
    }
    const isCodex = engine === "high" || engine === "codex";
    const key = isCodex ? env("OPENAI_API_KEY") : env("MERCURY_API_KEY");
    const base = isCodex ? "https://api.openai.com/v1" : (env("MERCURY_BASE_URL") || "").replace(/\/$/, "");
    const model = isCodex ? env("OPENAI_MODEL") || "gpt-4o" : env("MERCURY_MODEL") || "mercury-2";
    if (!key || !isCodex && !base) {
      return json({ needsKey: true, env: isCodex ? "OPENAI_API_KEY" : "MERCURY_API_KEY" });
    }
    const res = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: sys }, ...userMsgs],
        temperature: mode === "mockup" ? 0.7 : 0.8,
        max_tokens: maxTokens
      }),
      signal: AbortSignal.timeout(12e4)
    });
    const data = await res.json();
    if (!res.ok) return json({ error: data?.error?.message || "engine error", raw: data }, 502);
    let out = data.choices?.[0]?.message?.content || "";
    if (mode === "mockup") out = strip(out);
    return json({ ok: true, output: out });
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
