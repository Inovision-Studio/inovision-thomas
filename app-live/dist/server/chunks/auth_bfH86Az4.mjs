import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = "iv_admin";
const ISSUER = "inovision-studios";
const AUDIENCE = "inovision-admin";
const SESSION_HOURS = 12;
function secretKey() {
  const raw = process.env.AUTH_SECRET;
  if (!raw || raw.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short. Set a long random string in .env");
  }
  return new TextEncoder().encode(raw);
}
const AUTH_COOKIE = COOKIE_NAME;
const AUTH_MAX_AGE_S = SESSION_HOURS * 60 * 60;
async function createToken(user) {
  return await new SignJWT({ name: user.name }).setProtectedHeader({ alg: "HS256" }).setIssuer(ISSUER).setAudience(AUDIENCE).setSubject(user.email).setIssuedAt().setExpirationTime(`${SESSION_HOURS}h`).sign(secretKey());
}
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER, audience: AUDIENCE });
    if (!payload.sub) return null;
    return {
      email: String(payload.sub),
      name: String(payload.name || ""),
      iat: payload.iat,
      exp: payload.exp
    };
  } catch {
    return null;
  }
}
async function getSession(cookies) {
  const t = cookies.get(COOKIE_NAME)?.value;
  return t ? verifyToken(t) : null;
}

export { AUTH_COOKIE as A, AUTH_MAX_AGE_S as a, createToken as c, getSession as g, verifyToken as v };
