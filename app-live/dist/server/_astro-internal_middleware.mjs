import { e as defineMiddleware, s as sequence } from './chunks/render-context_ES1j1GMM.mjs';
import { A as AUTH_COOKIE, v as verifyToken } from './chunks/auth_bfH86Az4.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_C9A3lwL4.mjs';
import 'piccolore';
import './chunks/astro/server_BTR06tDd.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdminPage = (pathname === "/admin" || pathname.startsWith("/admin/")) && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/");
  if (isAdminPage || isAdminApi) {
    const token = context.cookies.get(AUTH_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session) {
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      return context.redirect(
        `/admin/login?from=${encodeURIComponent(pathname)}`,
        302
      );
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
