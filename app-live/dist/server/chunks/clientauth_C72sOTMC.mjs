import { jwtVerify, SignJWT } from 'jose';

const COOKIE_NAME = "iv_client";
const ISSUER = "inovision-studios";
const AUDIENCE = "inovision-client";
const SESSION_HOURS = 72;
function secretKey() {
  const raw = process.env.AUTH_SECRET;
  if (!raw || raw.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short. Set a long random string in .env");
  }
  return new TextEncoder().encode(raw);
}
const CLIENT_COOKIE = COOKIE_NAME;
const CLIENT_MAX_AGE_S = SESSION_HOURS * 60 * 60;
async function createClientToken(c) {
  return await new SignJWT({ name: c.name, cid: c.id }).setProtectedHeader({ alg: "HS256" }).setIssuer(ISSUER).setAudience(AUDIENCE).setSubject(c.email).setIssuedAt().setExpirationTime(`${SESSION_HOURS}h`).sign(secretKey());
}
async function verifyClientToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER, audience: AUDIENCE });
    const cid = payload.cid;
    if (!payload.sub || !cid) return null;
    return { id: Number(cid), email: String(payload.sub), name: String(payload.name || "") };
  } catch {
    return null;
  }
}
async function getClientSession(cookies) {
  const t = cookies.get(COOKIE_NAME)?.value;
  return t ? verifyClientToken(t) : null;
}

export { CLIENT_COOKIE as C, CLIENT_MAX_AGE_S as a, createClientToken as c, getClientSession as g };
