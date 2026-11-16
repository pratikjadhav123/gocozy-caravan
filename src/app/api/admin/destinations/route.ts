import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/cms";
import {
  deleteDestination,
  listDestinations,
  slugify,
  upsertDestination,
} from "@/lib/cms-home";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const destinations = await listDestinations();
    return NextResponse.json({ ok: true, destinations });
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
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    if (!name) return NextResponse.json({ ok: false, error: "Name required" }, { status: 400 });

    const slug = String(form.get("slug") || "").trim() || slugify(name);
    let image = String(form.get("imageUrl") || "").trim();
    const imageFile = form.get("image");
    if (imageFile instanceof File && imageFile.size > 0) {
      const saved = await saveUploadedFile(imageFile, "destinations");
      image = saved.url;
    }
    if (!image) {
      return NextResponse.json({ ok: false, error: "Upload a destination image" }, { status: 400 });
    }

    await upsertDestination({
      slug,
      name,
      blurb: String(form.get("blurb") || ""),
      image,
      sort_order: Number(form.get("sort_order") || 0),
      show_on_home: String(form.get("show_on_home") || "1") !== "0",
      is_active: String(form.get("is_active") || "1") !== "0",
    });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[admin/destinations POST]", err);
    return NextResponse.json({ ok: false, error: "Could not save destination" }, { status: 500 });
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
  await deleteDestination(slug);
  return NextResponse.json({ ok: true });
}
