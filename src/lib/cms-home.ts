import type { RowDataPacket } from "mysql2";
import { queryExec, queryRows } from "@/lib/db";
import { AMENITIES } from "@/lib/constants";
import { TRAVEL_DESTINATIONS } from "@/lib/content";

export type HeroSlideRow = RowDataPacket & {
  id: number;
  slug: string;
  eyebrow: string;
  title: string;
  highlight: string;
  caption: string | null;
  image: string;
  alt_text: string | null;
  sort_order: number;
  is_active: number;
};

export type DestinationRow = RowDataPacket & {
  id: number;
  slug: string;
  name: string;
  blurb: string | null;
  image: string;
  sort_order: number;
  show_on_home: number;
  is_active: number;
};

export type AmenityRow = RowDataPacket & {
  id: number;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: number;
};

export type HeroSlide = {
  slug: string;
  eyebrow: string;
  title: string;
  highlight: string;
  caption: string;
  image: string;
  alt: string;
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 140);
}

export async function listHeroSlides(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM cms_hero_slides WHERE is_active = 1 ORDER BY sort_order, id`
    : `SELECT * FROM cms_hero_slides ORDER BY sort_order, id`;
  return queryRows<HeroSlideRow[]>(sql);
}

export async function getHeroSlidesForSite(): Promise<HeroSlide[]> {
  try {
    const rows = await listHeroSlides(true);
    if (!rows.length) return fallbackHero();
    return rows.map((r) => ({
      slug: r.slug,
      eyebrow: r.eyebrow || "Luxury caravan travel across India",
      title: r.title,
      highlight: r.highlight || "",
      caption: r.caption || "",
      image: r.image,
      alt: r.alt_text || r.title,
    }));
  } catch {
    return fallbackHero();
  }
}

function fallbackHero(): HeroSlide[] {
  return [
    {
      slug: "slide-1",
      eyebrow: "Luxury caravan travel across India",
      title: "Your Journey,",
      highlight: "Your Home On Wheels.",
      caption: "Luxury motorhomes & caravans for India road trips.",
      image: "/images/slider/slide-1.png",
      alt: "Go Cozy motorhome with outdoor seating",
    },
  ];
}

export async function upsertHeroSlide(input: {
  slug: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  caption?: string;
  image: string;
  alt_text?: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  await queryExec(
    `INSERT INTO cms_hero_slides
      (slug, eyebrow, title, highlight, caption, image, alt_text, sort_order, is_active)
     VALUES
      (:slug, :eyebrow, :title, :highlight, :caption, :image, :alt_text, :sort_order, :is_active)
     ON DUPLICATE KEY UPDATE
      eyebrow=VALUES(eyebrow), title=VALUES(title), highlight=VALUES(highlight),
      caption=VALUES(caption), image=VALUES(image), alt_text=VALUES(alt_text),
      sort_order=VALUES(sort_order), is_active=VALUES(is_active)`,
    {
      slug: input.slug,
      eyebrow: input.eyebrow || "",
      title: input.title,
      highlight: input.highlight || "",
      caption: input.caption || "",
      image: input.image,
      alt_text: input.alt_text || input.title,
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active === false ? 0 : 1,
    }
  );
}

export async function deleteHeroSlide(slug: string) {
  await queryExec(`DELETE FROM cms_hero_slides WHERE slug = :slug`, { slug });
}

export async function listDestinations(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM cms_destinations WHERE is_active = 1 ORDER BY sort_order, id`
    : `SELECT * FROM cms_destinations ORDER BY sort_order, id`;
  return queryRows<DestinationRow[]>(sql);
}

export async function getHomeDestinations() {
  try {
    const rows = await queryRows<DestinationRow[]>(
      `SELECT * FROM cms_destinations
       WHERE is_active = 1 AND show_on_home = 1
       ORDER BY sort_order, id LIMIT 8`
    );
    if (!rows.length) {
      return TRAVEL_DESTINATIONS.slice(0, 4).map((d) => ({
        slug: d.slug,
        name: d.name,
        image: d.image,
        blurb: d.blurb,
      }));
    }
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      image: r.image,
      blurb: r.blurb || "",
    }));
  } catch {
    return TRAVEL_DESTINATIONS.slice(0, 4).map((d) => ({
      slug: d.slug,
      name: d.name,
      image: d.image,
      blurb: d.blurb,
    }));
  }
}

export async function upsertDestination(input: {
  slug: string;
  name: string;
  blurb?: string;
  image: string;
  sort_order?: number;
  show_on_home?: boolean;
  is_active?: boolean;
}) {
  await queryExec(
    `INSERT INTO cms_destinations
      (slug, name, blurb, image, sort_order, show_on_home, is_active)
     VALUES
      (:slug, :name, :blurb, :image, :sort_order, :show_on_home, :is_active)
     ON DUPLICATE KEY UPDATE
      name=VALUES(name), blurb=VALUES(blurb), image=VALUES(image),
      sort_order=VALUES(sort_order), show_on_home=VALUES(show_on_home), is_active=VALUES(is_active)`,
    {
      slug: input.slug,
      name: input.name,
      blurb: input.blurb || "",
      image: input.image,
      sort_order: input.sort_order ?? 0,
      show_on_home: input.show_on_home === false ? 0 : 1,
      is_active: input.is_active === false ? 0 : 1,
    }
  );
}

export async function deleteDestination(slug: string) {
  await queryExec(`DELETE FROM cms_destinations WHERE slug = :slug`, { slug });
}

export async function listAmenities(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM cms_amenities WHERE is_active = 1 ORDER BY sort_order, id`
    : `SELECT * FROM cms_amenities ORDER BY sort_order, id`;
  return queryRows<AmenityRow[]>(sql);
}

export async function getAmenitiesForSite() {
  try {
    const rows = await listAmenities(true);
    if (!rows.length) {
      return AMENITIES.map((a) => ({ title: a.title, description: a.description }));
    }
    return rows.map((r) => ({ title: r.title, description: r.description }));
  } catch {
    return AMENITIES.map((a) => ({ title: a.title, description: a.description }));
  }
}

export async function upsertAmenity(input: {
  slug: string;
  title: string;
  description: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  await queryExec(
    `INSERT INTO cms_amenities (slug, title, description, sort_order, is_active)
     VALUES (:slug, :title, :description, :sort_order, :is_active)
     ON DUPLICATE KEY UPDATE
      title=VALUES(title), description=VALUES(description),
      sort_order=VALUES(sort_order), is_active=VALUES(is_active)`,
    {
      slug: input.slug,
      title: input.title,
      description: input.description,
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active === false ? 0 : 1,
    }
  );
}

export async function deleteAmenity(slug: string) {
  await queryExec(`DELETE FROM cms_amenities WHERE slug = :slug`, { slug });
}
