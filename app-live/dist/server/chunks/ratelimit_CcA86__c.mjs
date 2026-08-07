const hits = /* @__PURE__ */ new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const e = hits.get(key);
  if (!e || now > e.reset) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  if (e.n >= max) return false;
  e.n += 1;
  return true;
}
function clientIp(request, fallback) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || fallback || "unknown";
}

export { clientIp as c, rateLimit as r };
