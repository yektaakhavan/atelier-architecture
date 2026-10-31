import { artFileNames, parseArtFileName } from "@/lib/art";
import { artSvg } from "@/lib/art-svg";

// The placeholder artwork is generated once at build time and served as a cacheable file, so a
// page shows it with a single <img> instead of ~16 inline SVG nodes that React would hydrate.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return artFileNames.map((file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const art = parseArtFileName((await params).file);
  if (!art) return new Response("Not found", { status: 404 });

  return new Response(artSvg(art.variant, art.tone), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
