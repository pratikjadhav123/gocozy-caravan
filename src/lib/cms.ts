import { promises as fs } from "fs";
import path from "path";
import type { RowDataPacket } from "mysql2";
import { queryExec, queryRows } from "@/lib/db";
import { TRIP_PACKAGES } from "@/lib/constants";

export type MediaRow = RowDataPacket & {
  id: number;
  slot_key: string;
  label: string;
  section: string;
  file_url: string;
  alt_text: string | null;
  is_active: number;
  updated_at: string;
};

export type PackageRow = RowDataPacket & {
  id: number;
  package_key: string;
  option_label: string;
  title: string;
  price: string;
  unit: string;
  description: string | null;
  includes_json: string | null;
  excludes: string | null;
  cta_label: string;
  wa_message: string | null;
  sort_order: number;
  is_active: number;
};

export type TextRow = RowDataPacket & {
  text_key: string;
  label: string;
  content: string;
  updated_at: string;
};

export type TripPackageView = {
  id: string;
  option: string;
  title: string;
  price: string;
  unit: string;
  description: string;
  includes: string[];
  excludes: string;
  cta: string;
  waMessage: string;
};

const MEDIA_SECTIONS = [
  { id: "home_fleet", label: "Home — Our Fleet images" },
  { id: "home_gallery", label: "Home — Gallery images" },
  { id: "blog", label: "Blog images" },
  { id: "packages", label: "Packages images" },
] as const;

export function getMediaSections() {
  return MEDIA_SECTIONS;
}

export async function listMedia(section?: string) {
  if (section && section !== "all") {
    return queryRows<MediaRow[]>(
      `SELECT * FROM site_media WHERE section = :section ORDER BY section, slot_key`,
      { section }
    );
  }
  return queryRows<MediaRow[]>(`SELECT * FROM site_media ORDER BY section, slot_key`);
}

export async function getMediaBySlot(slotKey: string) {
  const rows = await queryRows<MediaRow[]>(
    `SELECT * FROM site_media WHERE slot_key = :slot_key AND is_active = 1 LIMIT 1`,
    { slot_key: slotKey }
  );
  return rows[0] ?? null;
}

export async function getMediaMap(section?: string) {
  try {
    const rows = await listMedia(section);
    return Object.fromEntries(rows.filter((r) => r.is_active).map((r) => [r.slot_key, r]));
  } catch {
    return {} as Record<string, MediaRow>;
  }
}

export async function updateMediaFile(
  slotKey: string,
  fileUrl: string,
  altText?: string,
  section = "general",
  label?: string
) {
  await queryExec(
    `INSERT INTO site_media (slot_key, label, section, file_url, alt_text, is_active)
     VALUES (:slot_key, :label, :section, :file_url, :alt_text, 1)
     ON DUPLICATE KEY UPDATE
       file_url = VALUES(file_url),
       alt_text = COALESCE(VALUES(alt_text), alt_text),
       section = VALUES(section),
       label = VALUES(label)`,
    {
      slot_key: slotKey,
      label: label || slotKey,
      section,
      file_url: fileUrl,
      alt_text: altText?.trim() || null,
    }
  );
  return getMediaBySlot(slotKey);
}

export async function listPackages(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM site_packages WHERE is_active = 1 ORDER BY sort_order, id`
    : `SELECT * FROM site_packages ORDER BY sort_order, id`;
  return queryRows<PackageRow[]>(sql);
}

export async function getPackagesForSite(): Promise<TripPackageView[]> {
  try {
    const rows = await listPackages(true);
    if (!rows.length) return fallbackPackages();
    return rows.map((row) => ({
      id: row.package_key,
      option: row.option_label,
      title: row.title,
      price: row.price,
      unit: row.unit,
      description: row.description || "",
      includes: safeJsonArray(row.includes_json),
      excludes: row.excludes || "",
      cta: row.cta_label,
      waMessage: row.wa_message || "",
    }));
  } catch {
    return fallbackPackages();
  }
}

export async function updatePackage(
  packageKey: string,
  patch: {
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
  }
) {
  await queryExec(
    `UPDATE site_packages SET
      option_label = COALESCE(:option_label, option_label),
      title = COALESCE(:title, title),
      price = COALESCE(:price, price),
      unit = COALESCE(:unit, unit),
      description = COALESCE(:description, description),
      includes_json = COALESCE(:includes_json, includes_json),
      excludes = COALESCE(:excludes, excludes),
      cta_label = COALESCE(:cta_label, cta_label),
      wa_message = COALESCE(:wa_message, wa_message),
      is_active = COALESCE(:is_active, is_active)
     WHERE package_key = :package_key`,
    {
      package_key: packageKey,
      option_label: patch.option_label ?? null,
      title: patch.title ?? null,
      price: patch.price ?? null,
      unit: patch.unit ?? null,
      description: patch.description ?? null,
      includes_json: patch.includes ? JSON.stringify(patch.includes) : null,
      excludes: patch.excludes ?? null,
      cta_label: patch.cta_label ?? null,
      wa_message: patch.wa_message ?? null,
      is_active: typeof patch.is_active === "boolean" ? (patch.is_active ? 1 : 0) : null,
    }
  );
}

export async function getTextsMap() {
  try {
    const rows = await queryRows<TextRow[]>(`SELECT * FROM site_texts`);
    return Object.fromEntries(rows.map((r) => [r.text_key, r.content]));
  } catch {
    return {} as Record<string, string>;
  }
}

export async function listTexts() {
  return queryRows<TextRow[]>(`SELECT * FROM site_texts ORDER BY text_key`);
}

export async function updateText(textKey: string, content: string, label?: string) {
  await queryExec(
    `INSERT INTO site_texts (text_key, label, content)
     VALUES (:text_key, :label, :content)
     ON DUPLICATE KEY UPDATE content = VALUES(content)`,
    {
      text_key: textKey,
      label: label || textKey,
      content,
    }
  );
}

/** Seed missing text rows without overwriting edits. */
export async function ensureTexts(
  entries: { text_key: string; label: string; content: string }[]
) {
  for (const entry of entries) {
    await queryExec(
      `INSERT INTO site_texts (text_key, label, content)
       VALUES (:text_key, :label, :content)
       ON DUPLICATE KEY UPDATE text_key = text_key`,
      entry
    );
  }
}

export const TOUR_TEXT_DEFAULTS = [
  {
    text_key: "home_tour_eyebrow",
    label: "Home — Tour eyebrow",
    content: "Take a closer look",
  },
  {
    text_key: "home_tour_title",
    label: "Home — Tour title",
    content: "Step inside",
  },
  {
    text_key: "home_tour_highlight",
    label: "Home — Tour highlight (script line)",
    content: "your next adventure.",
  },
  {
    text_key: "home_tour_body",
    label: "Home — Tour body",
    content:
      "See the layout, discover the amenities and get a feel for life on board before you enquire.",
  },
  {
    text_key: "home_tour_cta",
    label: "Home — Tour CTA label",
    content: "Watch the caravan tour",
  },
  {
    text_key: "home_tour_url",
    label: "Home — Tour YouTube / video URL",
    content: "",
  },
  {
    text_key: "home_tour_badge",
    label: "Home — Tour video badge",
    content: "Caravan walkthrough",
  },
] as const;

export async function saveUploadedFile(
  file: File,
  section: string
): Promise<{ url: string; absolutePath: string }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name || "").toLowerCase() || guessExt(file.type);
  const safeSection = section.replace(/[^a-z0-9_-]/gi, "") || "general";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", safeSection);
  await fs.mkdir(dir, { recursive: true });
  const absolutePath = path.join(dir, fileName);
  await fs.writeFile(absolutePath, bytes);
  return {
    url: `/uploads/${safeSection}/${fileName}`,
    absolutePath,
  };
}

function guessExt(mime: string) {
  if (mime.includes("png")) return ".png";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("gif")) return ".gif";
  return ".jpg";
}

function safeJsonArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function fallbackPackages(): TripPackageView[] {
  return TRIP_PACKAGES.map((p) => ({
    id: p.id,
    option: p.option,
    title: p.title,
    price: p.price,
    unit: p.unit,
    description: p.description,
    includes: [...p.includes],
    excludes: p.excludes,
    cta: p.cta,
    waMessage: p.waMessage,
  }));
}
