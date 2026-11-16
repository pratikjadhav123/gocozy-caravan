import type { RowDataPacket } from "mysql2";
import { queryExec, queryRows } from "@/lib/db";
import { FAQS } from "@/lib/constants";

export type FaqRow = RowDataPacket & {
  id: number;
  slug: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: number;
  updated_at: string;
};

export type FaqItem = { q: string; a: string; slug?: string };

export function slugifyFaq(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export async function listFaqs(activeOnly = false) {
  const sql = activeOnly
    ? `SELECT * FROM cms_faqs WHERE is_active = 1 ORDER BY sort_order, id`
    : `SELECT * FROM cms_faqs ORDER BY sort_order, id`;
  return queryRows<FaqRow[]>(sql);
}

export async function getFaqsForSite(): Promise<FaqItem[]> {
  try {
    const rows = await listFaqs(true);
    if (!rows.length) {
      return FAQS.map((f) => ({ q: f.q, a: f.a }));
    }
    return rows.map((r) => ({ q: r.question, a: r.answer, slug: r.slug }));
  } catch {
    return FAQS.map((f) => ({ q: f.q, a: f.a }));
  }
}

export async function upsertFaq(input: {
  slug: string;
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  await queryExec(
    `INSERT INTO cms_faqs (slug, question, answer, sort_order, is_active)
     VALUES (:slug, :question, :answer, :sort_order, :is_active)
     ON DUPLICATE KEY UPDATE
       question = VALUES(question),
       answer = VALUES(answer),
       sort_order = VALUES(sort_order),
       is_active = VALUES(is_active)`,
    {
      slug: input.slug,
      question: input.question,
      answer: input.answer,
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active === false ? 0 : 1,
    }
  );
}

export async function deleteFaq(slug: string) {
  await queryExec(`DELETE FROM cms_faqs WHERE slug = :slug`, { slug });
}
