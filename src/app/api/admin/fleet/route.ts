import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  deleteCmsVehicle,
  listCmsVehicles,
  slugify,
  upsertCmsVehicle,
} from "@/lib/cms-content";
import { saveUploadedFile } from "@/lib/cms";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const vehicles = await listCmsVehicles();
    return NextResponse.json({ ok: true, vehicles });
  } catch (err) {
    console.error("[admin/fleet]", err);
    return NextResponse.json(
      { ok: false, error: "Run: node scripts/migrate-cms-content.mjs" },
      { status: 500 }
    );
  }
}

function collectFiles(form: FormData, key: string): File[] {
  return form
    .getAll(key)
    .filter((item): item is File => item instanceof File && item.size > 0);
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
    const coverFiles = collectFiles(form, "image");
    if (coverFiles[0]) {
      const saved = await saveUploadedFile(coverFiles[0], "fleet");
      image = saved.url;
    }

    let existingGallery: string[] = [];
    try {
      const parsed = JSON.parse(String(form.get("galleryExisting") || "[]")) as unknown;
      if (Array.isArray(parsed)) {
        existingGallery = parsed.map(String).map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      existingGallery = [];
    }

    const uploadedGallery: string[] = [];
    for (const file of collectFiles(form, "galleryFiles")) {
      if (!file.type.startsWith("image/")) continue;
      const saved = await saveUploadedFile(file, "fleet-gallery");
      uploadedGallery.push(saved.url);
    }

    const gallerySrcs = [...existingGallery, ...uploadedGallery];
    if (!image && gallerySrcs[0]) image = gallerySrcs[0];
    if (!image) image = "/images/slider/slide-2.png";

    const uniqueGallery = Array.from(new Set(gallerySrcs.length ? gallerySrcs : [image]));
    const gallery = uniqueGallery.map((src) => ({ src, alt: name }));

    await upsertCmsVehicle({
      slug,
      name,
      tagline: String(form.get("tagline") || ""),
      seats: String(form.get("seats") || ""),
      beds: String(form.get("beds") || "") || null,
      highlight: String(form.get("highlight") || ""),
      image,
      about: String(form.get("about") || ""),
      gallery,
      specs: [
        { label: "Seats", value: String(form.get("seats") || "") },
        { label: "Sleeps", value: String(form.get("beds") || "Day travel") },
      ],
      features: String(form.get("features") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, ...rest] = line.split(":");
          return { title: title.trim(), description: rest.join(":").trim() || title.trim() };
        }),
      sort_order: Number(form.get("sort_order") || 0),
      is_active: String(form.get("is_active") || "1") !== "0",
    });

    return NextResponse.json({
      ok: true,
      slug,
      galleryCount: gallery.length,
      added: uploadedGallery.length,
    });
  } catch (err) {
    console.error("[admin/fleet POST]", err);
    return NextResponse.json({ ok: false, error: "Could not save vehicle" }, { status: 500 });
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
  await deleteCmsVehicle(slug);
  return NextResponse.json({ ok: true });
}
