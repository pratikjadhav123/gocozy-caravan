import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/cms";
import {
  createMediaLibraryItem,
  deleteMediaLibraryItem,
  listMediaLibrary,
  updateMediaLibraryItem,
} from "@/lib/media-library";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const items = await listMediaLibrary({
      category: searchParams.get("category") || undefined,
      q: searchParams.get("q") || undefined,
    });
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error("[media-library GET]", err);
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
    const category = String(form.get("category") || "general").trim() || "general";
    const defaultTitle = String(form.get("title") || "").trim();
    const defaultAlt = String(form.get("alt_text") || "").trim();
    const files = form
      .getAll("files")
      .filter((f): f is File => f instanceof File && f.size > 0);

    if (!files.length) {
      return NextResponse.json({ ok: false, error: "Select at least one image" }, { status: 400 });
    }

    const uploaded: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 8 * 1024 * 1024) continue;
      const saved = await saveUploadedFile(file, "media-library");
      const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
      await createMediaLibraryItem({
        title: defaultTitle || baseName || "Untitled image",
        category,
        alt_text: defaultAlt || baseName || defaultTitle || "Website image",
        file_url: saved.url,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      });
      uploaded.push(saved.url);
    }

    if (!uploaded.length) {
      return NextResponse.json(
        { ok: false, error: "No valid images uploaded (max 8MB each)" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, count: uploaded.length, urls: uploaded });
  } catch (err) {
    console.error("[media-library POST]", err);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      id?: number;
      title?: string;
      category?: string;
      alt_text?: string;
    };
    const id = Number(body.id);
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title required" }, { status: 400 });

    await updateMediaLibraryItem(id, {
      title,
      category: String(body.category || "general"),
      alt_text: String(body.alt_text || ""),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[media-library PATCH]", err);
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  await deleteMediaLibraryItem(id);
  return NextResponse.json({ ok: true });
}
