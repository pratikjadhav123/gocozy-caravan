import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/cms";
import {
  deleteCmsBlogPost,
  listCmsBlogPosts,
  slugify,
  upsertCmsBlogPost,
} from "@/lib/cms-content";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const posts = await listCmsBlogPosts();
    return NextResponse.json({ ok: true, posts });
  } catch (err) {
    console.error("[admin/blog]", err);
    return NextResponse.json(
      { ok: false, error: "Run: node scripts/migrate-cms-content.mjs" },
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
    const imageFile = form.get("image");
    let image = String(form.get("imageUrl") || "").trim();
    if (imageFile instanceof File && imageFile.size > 0) {
      const saved = await saveUploadedFile(imageFile, "blog");
      image = saved.url;
    }
    if (!image) image = "/images/slider/slide-1.png";

    const content = String(form.get("content") || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const postDate = String(form.get("post_date") || new Date().toISOString().slice(0, 10));
    const dateObj = new Date(`${postDate}T12:00:00`);
    const dateLabel = Number.isNaN(dateObj.getTime())
      ? postDate
      : dateObj
          .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          .toUpperCase();

    await upsertCmsBlogPost({
      slug,
      title,
      category: String(form.get("category") || "Travel guides"),
      excerpt: String(form.get("excerpt") || ""),
      content,
      image,
      author: String(form.get("author") || "Go Cozy Team"),
      post_date: postDate,
      date_label: String(form.get("date_label") || dateLabel),
      read_mins: Number(form.get("read_mins") || 5),
      is_active: String(form.get("is_active") || "1") !== "0",
    });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[admin/blog POST]", err);
    return NextResponse.json({ ok: false, error: "Could not save blog post" }, { status: 500 });
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
  await deleteCmsBlogPost(slug);
  return NextResponse.json({ ok: true });
}
