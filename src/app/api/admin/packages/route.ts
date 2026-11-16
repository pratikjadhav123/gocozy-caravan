import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listPackages, updatePackage } from "@/lib/cms";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const packages = await listPackages();
    return NextResponse.json({ ok: true, packages });
  } catch (err) {
    console.error("[admin/packages]", err);
    return NextResponse.json(
      { ok: false, error: "CMS tables missing. Run: node scripts/migrate-cms.mjs" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    package_key?: string;
    option_label?: string;
    title?: string;
    price?: string;
    unit?: string;
    description?: string;
    includes?: string[];
    excludes?: string;
    cta_label?: string;
    wa_message?: string;
    is_active?: boolean;
  };

  if (!body.package_key) {
    return NextResponse.json({ ok: false, error: "package_key required" }, { status: 400 });
  }

  await updatePackage(body.package_key, body);
  const packages = await listPackages();
  return NextResponse.json({ ok: true, packages });
}
