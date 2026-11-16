import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  deleteAmenity,
  listAmenities,
  slugify,
  upsertAmenity,
} from "@/lib/cms-home";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const amenities = await listAmenities();
    return NextResponse.json({ ok: true, amenities });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Run: node scripts/migrate-home-sections.mjs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      slug?: string;
      title?: string;
      description?: string;
      sort_order?: number;
      is_active?: boolean;
    };
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title required" }, { status: 400 });

    const slug = String(body.slug || "").trim() || slugify(title);
    await upsertAmenity({
      slug,
      title,
      description: String(body.description || "").trim(),
      sort_order: Number(body.sort_order || 0),
      is_active: body.is_active !== false,
    });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[admin/amenities POST]", err);
    return NextResponse.json({ ok: false, error: "Could not save amenity" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  await deleteAmenity(slug);
  return NextResponse.json({ ok: true });
}
