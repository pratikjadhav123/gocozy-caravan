import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/cms";
import {
  deleteHeroSlide,
  listHeroSlides,
  slugify,
  upsertHeroSlide,
} from "@/lib/cms-home";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const slides = await listHeroSlides();
    return NextResponse.json({ ok: true, slides });
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
    const title = String(form.get("title") || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title required" }, { status: 400 });

    const slug = String(form.get("slug") || "").trim() || slugify(title);
    let image = String(form.get("imageUrl") || "").trim();
    const imageFile = form.get("image");
    if (imageFile instanceof File && imageFile.size > 0) {
      const saved = await saveUploadedFile(imageFile, "hero");
      image = saved.url;
    }
    if (!image) {
      return NextResponse.json({ ok: false, error: "Upload a hero image" }, { status: 400 });
    }

    await upsertHeroSlide({
      slug,
      eyebrow: String(form.get("eyebrow") || ""),
      title,
      highlight: String(form.get("highlight") || ""),
      caption: String(form.get("caption") || ""),
      image,
      alt_text: String(form.get("alt_text") || title),
      sort_order: Number(form.get("sort_order") || 0),
      is_active: String(form.get("is_active") || "1") !== "0",
    });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[admin/hero POST]", err);
    return NextResponse.json({ ok: false, error: "Could not save slide" }, { status: 500 });
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
  await deleteHeroSlide(slug);
  return NextResponse.json({ ok: true });
}
