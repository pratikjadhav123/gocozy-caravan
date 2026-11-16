import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteFaq, listFaqs, slugifyFaq, upsertFaq } from "@/lib/cms-faq";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const faqs = await listFaqs();
    return NextResponse.json({ ok: true, faqs });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Run: node scripts/migrate-faqs.mjs" },
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
      question?: string;
      answer?: string;
      sort_order?: number;
      is_active?: boolean;
    };
    const question = String(body.question || "").trim();
    const answer = String(body.answer || "").trim();
    if (!question || !answer) {
      return NextResponse.json({ ok: false, error: "Question and answer required" }, { status: 400 });
    }

    const slug = String(body.slug || "").trim() || slugifyFaq(question);
    await upsertFaq({
      slug,
      question,
      answer,
      sort_order: Number(body.sort_order || 0),
      is_active: body.is_active !== false,
    });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[admin/faqs POST]", err);
    return NextResponse.json({ ok: false, error: "Could not save FAQ" }, { status: 500 });
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
  await deleteFaq(slug);
  return NextResponse.json({ ok: true });
}
