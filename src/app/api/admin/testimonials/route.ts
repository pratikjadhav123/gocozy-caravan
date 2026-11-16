import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/cms";
import {
  deleteTestimonial,
  listTestimonials,
  slugify,
  upsertTestimonial,
} from "@/lib/media-library";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const testimonials = await listTestimonials();
    return NextResponse.json({ ok: true, testimonials });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Run: node scripts/migrate-media-library.mjs" },
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
    const customer_name = String(form.get("customer_name") || "").trim();
    const review = String(form.get("review") || "").trim();
    if (!customer_name || !review) {
      return NextResponse.json({ ok: false, error: "Name and review required" }, { status: 400 });
    }

    const slug = String(form.get("slug") || "").trim() || slugify(customer_name);
    let photo_url = String(form.get("photoUrl") || "").trim() || null;
    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const saved = await saveUploadedFile(photo, "testimonials");
      photo_url = saved.url;
    }

    await upsertTestimonial({
      slug,
      customer_name,
      rating: Number(form.get("rating") || 5),
      review,
      photo_url,
      location: String(form.get("location") || ""),
      sort_order: Number(form.get("sort_order") || 0),
      is_active: String(form.get("is_active") || "1") !== "0",
    });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[testimonials POST]", err);
    return NextResponse.json({ ok: false, error: "Could not save testimonial" }, { status: 500 });
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
  await deleteTestimonial(slug);
  return NextResponse.json({ ok: true });
}
