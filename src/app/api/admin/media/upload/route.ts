import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile, updateMediaFile } from "@/lib/cms";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const slotKey = String(form.get("slotKey") || "");
    const section = String(form.get("section") || "general");
    const altText = String(form.get("altText") || "");
    const label = String(form.get("label") || slotKey);
    const file = form.get("file");

    if (!slotKey) {
      return NextResponse.json({ ok: false, error: "slotKey required" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "file required" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Only image uploads allowed" }, { status: 400 });
    }
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Max file size is 6MB" }, { status: 400 });
    }

    const saved = await saveUploadedFile(file, section);
    const media = await updateMediaFile(slotKey, saved.url, altText || undefined, section, label);

    return NextResponse.json({ ok: true, url: saved.url, media });
  } catch (err) {
    console.error("[admin/media/upload]", err);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
