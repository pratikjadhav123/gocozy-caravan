import { NextResponse } from "next/server";
import { getMediaMap, getPackagesForSite, getTextsMap } from "@/lib/cms";

/** Public content API for checking dynamic CMS data */
export async function GET() {
  const [media, packages, texts] = await Promise.all([
    getMediaMap(),
    getPackagesForSite(),
    getTextsMap(),
  ]);

  return NextResponse.json({
    ok: true,
    media: Object.fromEntries(
      Object.entries(media).map(([key, row]) => [
        key,
        { url: row.file_url, alt: row.alt_text, label: row.label, section: row.section },
      ])
    ),
    packages,
    texts,
  });
}
