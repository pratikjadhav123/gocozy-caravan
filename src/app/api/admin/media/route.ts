import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listMedia } from "@/lib/cms";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const section = new URL(request.url).searchParams.get("section") || undefined;
  try {
    const media = await listMedia(section || undefined);
    return NextResponse.json({ ok: true, media });
  } catch (err) {
    console.error("[admin/media]", err);
    return NextResponse.json(
      { ok: false, error: "CMS tables missing. Run: node scripts/migrate-cms.mjs" },
      { status: 500 }
    );
  }
}
