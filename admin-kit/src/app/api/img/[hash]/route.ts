import { serveImage, widthFromUrl } from "@/lib/imageServe";

export async function GET(req: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  return serveImage(`h:${hash}`, { hash }, widthFromUrl(req.url));
}
