import type { RowDataPacket } from "mysql2";
import { queryExec, queryRows } from "@/lib/db";
export { MEDIA_CATEGORIES } from "@/lib/media-categories";

export type MediaLibraryRow = RowDataPacket & {
  id: number;
  title: string;
  category: string;
  alt_text: string | null;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = RowDataPacket & {
  id: number;
  slug: string;
  customer_name: string;
  rating: number;
  review: string;
  photo_url: string | null;
  location: string | null;
  sort_order: number;
  is_active: number;
};

export async function listMediaLibrary(opts?: {
  category?: string;
  q?: string;
}) {
  const category = opts?.category && opts.category !== "all" ? opts.category : "";
  const q = opts?.q?.trim() || "";

  if (category && q) {
    return queryRows<MediaLibraryRow[]>(
      `SELECT * FROM media_library
       WHERE category = :category
         AND (title LIKE :q OR alt_text LIKE :q OR file_name LIKE :q)
       ORDER BY created_at DESC, id DESC`,
      { category, q: `%${q}%` }
    );
  }
  if (category) {
    return queryRows<MediaLibraryRow[]>(
      `SELECT * FROM media_library WHERE category = :category ORDER BY created_at DESC, id DESC`,
      { category }
    );
  }
  if (q) {
    return queryRows<MediaLibraryRow[]>(
      `SELECT * FROM media_library
       WHERE title LIKE :q OR alt_text LIKE :q OR file_name LIKE :q OR category LIKE :q
       ORDER BY created_at DESC, id DESC`,
      { q: `%${q}%` }
    );
  }
  return queryRows<MediaLibraryRow[]>(
    `SELECT * FROM media_library ORDER BY created_at DESC, id DESC`
  );
}

export async function getMediaLibraryItem(id: number) {
  const rows = await queryRows<MediaLibraryRow[]>(
    `SELECT * FROM media_library WHERE id = :id LIMIT 1`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createMediaLibraryItem(input: {
  title: string;
  category: string;
  alt_text?: string;
  file_url: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
}) {
  await queryExec(
    `INSERT INTO media_library
      (title, category, alt_text, file_url, file_name, file_size, mime_type)
     VALUES
      (:title, :category, :alt_text, :file_url, :file_name, :file_size, :mime_type)`,
    {
      title: input.title,
      category: input.category || "general",
      alt_text: input.alt_text || null,
      file_url: input.file_url,
      file_name: input.file_name || null,
      file_size: input.file_size ?? null,
      mime_type: input.mime_type || null,
    }
  );
}

export async function updateMediaLibraryItem(
  id: number,
  input: { title: string; category: string; alt_text?: string }
) {
  await queryExec(
    `UPDATE media_library
     SET title = :title, category = :category, alt_text = :alt_text
     WHERE id = :id`,
    {
      id,
      title: input.title,
      category: input.category || "general",
      alt_text: input.alt_text || null,
    }
  );
}

export async function deleteMediaLibraryItem(id: number) {
  await queryExec(`DELETE FROM media_library WHERE id = :id`, { id });
}

export async function listTestimonials(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM cms_testimonials WHERE is_active = 1 ORDER BY sort_order, id`
    : `SELECT * FROM cms_testimonials ORDER BY sort_order, id`;
  return queryRows<TestimonialRow[]>(sql);
}

export async function getTestimonialsForSite() {
  try {
    const rows = await listTestimonials(true);
    return rows.map((r) => ({
      slug: r.slug,
      customer_name: r.customer_name,
      rating: r.rating,
      review: r.review,
      photo_url: r.photo_url,
      location: r.location,
    }));
  } catch {
    return [];
  }
}

export async function upsertTestimonial(input: {
  slug: string;
  customer_name: string;
  rating?: number;
  review: string;
  photo_url?: string | null;
  location?: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  await queryExec(
    `INSERT INTO cms_testimonials
      (slug, customer_name, rating, review, photo_url, location, sort_order, is_active)
     VALUES
      (:slug, :customer_name, :rating, :review, :photo_url, :location, :sort_order, :is_active)
     ON DUPLICATE KEY UPDATE
      customer_name=VALUES(customer_name), rating=VALUES(rating), review=VALUES(review),
      photo_url=VALUES(photo_url), location=VALUES(location),
      sort_order=VALUES(sort_order), is_active=VALUES(is_active)`,
    {
      slug: input.slug,
      customer_name: input.customer_name,
      rating: Math.min(5, Math.max(1, Number(input.rating || 5))),
      review: input.review,
      photo_url: input.photo_url || null,
      location: input.location || "",
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active === false ? 0 : 1,
    }
  );
}

export async function deleteTestimonial(slug: string) {
  await queryExec(`DELETE FROM cms_testimonials WHERE slug = :slug`, { slug });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 140);
}
