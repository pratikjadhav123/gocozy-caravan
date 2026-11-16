import type { RowDataPacket } from "mysql2";
import { queryExec, queryRows } from "@/lib/db";
import { VEHICLES } from "@/lib/constants";
import { BLOG_POSTS } from "@/lib/content";

export type CmsVehicleRow = RowDataPacket & {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  seats: string;
  beds: string | null;
  highlight: string;
  image: string;
  about: string | null;
  gallery_json: string | null;
  specs_json: string | null;
  features_json: string | null;
  sort_order: number;
  is_active: number;
};

export type CmsBlogRow = RowDataPacket & {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  content_json: string | null;
  image: string;
  author: string;
  post_date: string;
  date_label: string;
  read_mins: number;
  is_active: number;
  sort_order: number;
};

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type SiteVehicle = {
  id: string;
  name: string;
  tagline: string;
  seats: string;
  beds: string | null;
  highlight: string;
  image: string;
  gallery: { src: string; alt: string }[];
  about: string;
  specs: { label: string; value: string }[];
  features: { title: string; description: string }[];
};

export type SiteBlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  dateLabel: string;
  author: string;
  readMins: number;
  excerpt: string;
  image: string;
  content: string[];
};

export function mapVehicleRow(row: CmsVehicleRow): SiteVehicle {
  return {
    id: row.slug,
    name: row.name,
    tagline: row.tagline,
    seats: row.seats,
    beds: row.beds,
    highlight: row.highlight,
    image: row.image,
    gallery: parseJson(row.gallery_json, [{ src: row.image, alt: row.name }]),
    about: row.about || "",
    specs: parseJson(row.specs_json, []),
    features: parseJson(row.features_json, []),
  };
}

export function mapBlogRow(row: CmsBlogRow): SiteBlogPost {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.post_date,
    dateLabel: row.date_label || row.post_date,
    author: row.author,
    readMins: row.read_mins,
    excerpt: row.excerpt || "",
    image: row.image,
    content: parseJson<string[]>(row.content_json, []),
  };
}

export async function listCmsVehicles(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM cms_vehicles WHERE is_active = 1 ORDER BY sort_order, id`
    : `SELECT * FROM cms_vehicles ORDER BY sort_order, id`;
  return queryRows<CmsVehicleRow[]>(sql);
}

function fallbackVehicles(): SiteVehicle[] {
  return VEHICLES.map((v) => ({
    id: v.id,
    name: v.name,
    tagline: v.tagline,
    seats: v.seats,
    beds: v.beds,
    highlight: v.highlight,
    image: v.image,
    gallery: v.gallery.map((g) => ({ ...g })),
    about: v.about,
    specs: v.specs.map((s) => ({ ...s })),
    features: v.features.map((f) => ({ ...f })),
  }));
}

function fallbackBlogPosts(): SiteBlogPost[] {
  return BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    date: p.date,
    dateLabel: p.dateLabel,
    author: p.author,
    readMins: p.readMins,
    excerpt: p.excerpt,
    image: p.image,
    content: [...p.content],
  }));
}

export async function getCmsVehiclesForSite(): Promise<SiteVehicle[]> {
  try {
    const rows = await listCmsVehicles(true);
    if (!rows.length) return fallbackVehicles();
    return rows.map(mapVehicleRow);
  } catch {
    return fallbackVehicles();
  }
}

export async function getCmsVehicleBySlug(slug: string): Promise<SiteVehicle | undefined> {
  try {
    if (slug === "cozy-urbaniya") slug = "cozy-urbania";
    const rows = await queryRows<CmsVehicleRow[]>(
      `SELECT * FROM cms_vehicles WHERE slug = :slug AND is_active = 1 LIMIT 1`,
      { slug }
    );
    if (rows[0]) return mapVehicleRow(rows[0]);
  } catch {
    // fallback
  }
  return fallbackVehicles().find(
    (v) => v.id === slug || (slug === "cozy-urbaniya" && v.id === "cozy-urbania")
  );
}

export async function upsertCmsVehicle(input: {
  slug: string;
  name: string;
  tagline?: string;
  seats?: string;
  beds?: string | null;
  highlight?: string;
  image?: string;
  about?: string;
  gallery?: { src: string; alt: string }[];
  specs?: { label: string; value: string }[];
  features?: { title: string; description: string }[];
  sort_order?: number;
  is_active?: boolean;
}) {
  await queryExec(
    `INSERT INTO cms_vehicles
      (slug, name, tagline, seats, beds, highlight, image, about, gallery_json, specs_json, features_json, sort_order, is_active)
     VALUES
      (:slug, :name, :tagline, :seats, :beds, :highlight, :image, :about, :gallery_json, :specs_json, :features_json, :sort_order, :is_active)
     ON DUPLICATE KEY UPDATE
      name=VALUES(name), tagline=VALUES(tagline), seats=VALUES(seats), beds=VALUES(beds),
      highlight=VALUES(highlight), image=VALUES(image), about=VALUES(about),
      gallery_json=VALUES(gallery_json), specs_json=VALUES(specs_json), features_json=VALUES(features_json),
      sort_order=VALUES(sort_order), is_active=VALUES(is_active)`,
    {
      slug: input.slug,
      name: input.name,
      tagline: input.tagline || "",
      seats: input.seats || "",
      beds: input.beds ?? null,
      highlight: input.highlight || "",
      image: input.image || "/images/slider/slide-2.png",
      about: input.about || "",
      gallery_json: JSON.stringify(input.gallery || [{ src: input.image || "/images/slider/slide-2.png", alt: input.name }]),
      specs_json: JSON.stringify(input.specs || []),
      features_json: JSON.stringify(input.features || []),
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active === false ? 0 : 1,
    }
  );
}

export async function deleteCmsVehicle(slug: string) {
  await queryExec(`DELETE FROM cms_vehicles WHERE slug = :slug`, { slug });
}

export async function listCmsBlogPosts(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM cms_blog_posts WHERE is_active = 1 ORDER BY post_date DESC, id DESC`
    : `SELECT * FROM cms_blog_posts ORDER BY post_date DESC, id DESC`;
  return queryRows<CmsBlogRow[]>(sql);
}

export async function getCmsBlogPostsForSite(): Promise<SiteBlogPost[]> {
  try {
    const rows = await listCmsBlogPosts(true);
    if (!rows.length) return fallbackBlogPosts();
    return rows.map(mapBlogRow);
  } catch {
    return fallbackBlogPosts();
  }
}

export async function getCmsBlogPostBySlug(slug: string): Promise<SiteBlogPost | undefined> {
  try {
    const rows = await queryRows<CmsBlogRow[]>(
      `SELECT * FROM cms_blog_posts WHERE slug = :slug AND is_active = 1 LIMIT 1`,
      { slug }
    );
    if (rows[0]) return mapBlogRow(rows[0]);
  } catch {
    // fallback
  }
  return fallbackBlogPosts().find((p) => p.slug === slug);
}

export async function upsertCmsBlogPost(input: {
  slug: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: string[];
  image?: string;
  author?: string;
  post_date?: string;
  date_label?: string;
  read_mins?: number;
  is_active?: boolean;
  sort_order?: number;
}) {
  const postDate = input.post_date || new Date().toISOString().slice(0, 10);
  await queryExec(
    `INSERT INTO cms_blog_posts
      (slug, title, category, excerpt, content_json, image, author, post_date, date_label, read_mins, is_active, sort_order)
     VALUES
      (:slug, :title, :category, :excerpt, :content_json, :image, :author, :post_date, :date_label, :read_mins, :is_active, :sort_order)
     ON DUPLICATE KEY UPDATE
      title=VALUES(title), category=VALUES(category), excerpt=VALUES(excerpt),
      content_json=VALUES(content_json), image=VALUES(image), author=VALUES(author),
      post_date=VALUES(post_date), date_label=VALUES(date_label), read_mins=VALUES(read_mins),
      is_active=VALUES(is_active), sort_order=VALUES(sort_order)`,
    {
      slug: input.slug,
      title: input.title,
      category: input.category || "Travel guides",
      excerpt: input.excerpt || "",
      content_json: JSON.stringify(input.content || []),
      image: input.image || "/images/slider/slide-1.png",
      author: input.author || "Go Cozy Team",
      post_date: postDate,
      date_label: input.date_label || postDate,
      read_mins: input.read_mins ?? 5,
      is_active: input.is_active === false ? 0 : 1,
      sort_order: input.sort_order ?? 0,
    }
  );
}

export async function deleteCmsBlogPost(slug: string) {
  await queryExec(`DELETE FROM cms_blog_posts WHERE slug = :slug`, { slug });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 140);
}
