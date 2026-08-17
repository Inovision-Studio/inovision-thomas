import { serveImage, widthFromUrl } from "@/lib/imageServe";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = parseInt(id, 10);
  if (!Number.isFinite(n)) return new Response("Bad id", { status: 400 });
  return serveImage(`n:${n}`, { id: n }, widthFromUrl(req.url));
}
