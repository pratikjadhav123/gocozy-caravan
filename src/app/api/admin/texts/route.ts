import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listTexts, updateText } from "@/lib/cms";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const texts = await listTexts();
    return NextResponse.json({ ok: true, texts });
  } catch (err) {
    console.error("[admin/texts]", err);
    return NextResponse.json({ ok: false, error: "CMS tables missing" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { text_key?: string; content?: string };
  if (!body.text_key || typeof body.content !== "string") {
    return NextResponse.json({ ok: false, error: "text_key and content required" }, { status: 400 });
  }

  await updateText(body.text_key, body.content);
  return NextResponse.json({ ok: true });
}
