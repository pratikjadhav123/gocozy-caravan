import { promises as fs } from "fs";
import path from "path";
import type { RowDataPacket } from "mysql2";
import { queryExec, queryRows } from "@/lib/db";

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

export type TextRow = RowDataPacket & {
  text_key: string;
  label: string;
  content: string;
  updated_at: string;
};

const MEDIA_SECTIONS = [
  { id: "home_fleet", label: "Home — Our Fleet images" },
  { id: "home_gallery", label: "Home — Gallery images" },
  { id: "home_cta", label: "Home — Plan your trip image" },
  { id: "blog", label: "Blog images" },
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

export const TESTIMONIAL_TEXT_DEFAULTS = [
  {
    text_key: "testimonials_title",
    label: "Testimonials — Section title",
    content: "What travellers say",
  },
  {
    text_key: "testimonials_subtitle",
    label: "Testimonials — Section subtitle",
    content: "Real feedback from families and groups who travelled with Go Cozy.",
  },
] as const;

export const HOME_CTA_TEXT_DEFAULTS = [
  {
    text_key: "home_cta_title",
    label: "Home CTA — Title",
    content: "Ready to plan your trip?",
  },
  {
    text_key: "home_cta_body",
    label: "Home CTA — Body text",
    content:
      "Share dates and group size — we confirm pricing on WhatsApp. Follow journeys on Instagram too.",
  },
  {
    text_key: "home_cta_phone",
    label: "Home CTA — Phone display",
    content: "+91 91451 11125",
  },
  {
    text_key: "home_cta_email",
    label: "Home CTA — Email",
    content: "GoCozyCaravan@gmail.com",
  },
  {
    text_key: "home_cta_office",
    label: "Home CTA — Office address",
    content:
      "Office 103, Gera Imperium Rise, opposite Wipro Circle, Hinjawadi Phase II, Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057",
  },
  {
    text_key: "home_cta_instagram_label",
    label: "Home CTA — Instagram label",
    content: "Instagram @gocozycaravan",
  },
  {
    text_key: "home_cta_instagram_url",
    label: "Home CTA — Instagram URL",
    content: "https://www.instagram.com/gocozycaravan",
  },
  {
    text_key: "home_cta_primary_label",
    label: "Home CTA — Primary button label",
    content: "Book a slot",
  },
  {
    text_key: "home_cta_primary_href",
    label: "Home CTA — Primary button link",
    content: "/book",
  },
  {
    text_key: "home_cta_secondary_label",
    label: "Home CTA — Secondary button label",
    content: "Contact us",
  },
  {
    text_key: "home_cta_secondary_href",
    label: "Home CTA — Secondary button link",
    content: "/contact",
  },
  {
    text_key: "home_cta_image_alt",
    label: "Home CTA — Image alt text",
    content: "Luxury caravan interior with seating and lighting",
  },
] as const;

/** Ensure a media slot row exists (does not overwrite file_url). */
export async function ensureMediaSlot(input: {
  slot_key: string;
  label: string;
  section: string;
  file_url?: string;
  alt_text?: string;
}) {
  await queryExec(
    `INSERT INTO site_media (slot_key, label, section, file_url, alt_text, is_active)
     VALUES (:slot_key, :label, :section, :file_url, :alt_text, 1)
     ON DUPLICATE KEY UPDATE
       label = VALUES(label),
       section = VALUES(section)`,
    {
      slot_key: input.slot_key,
      label: input.label,
      section: input.section,
      file_url: input.file_url || "/images/gallery/interior-lounge-2.png",
      alt_text: input.alt_text || null,
    }
  );
}

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
