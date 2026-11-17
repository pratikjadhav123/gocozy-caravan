import { AmenitiesEditor } from "@/components/admin/AmenitiesEditor";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { FaqEditor } from "@/components/admin/FaqEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { TextsEditor } from "@/components/admin/TextsEditor";
import {
  ensureMediaSlot,
  ensureTexts,
  HOME_CTA_TEXT_DEFAULTS,
  listMedia,
  listTexts,
  TOUR_TEXT_DEFAULTS,
} from "@/lib/cms";
import { listCmsBlogPosts } from "@/lib/cms-content";
import { listFaqs } from "@/lib/cms-faq";
import { listAmenities } from "@/lib/cms-home";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ section?: string }>;
};

const SECTIONS = [
  { id: "about", label: "About Us" },
  { id: "amenities", label: "Amenities" },
  { id: "tour", label: "Tour video" },
  { id: "cta", label: "Plan trip CTA" },
  { id: "faq", label: "FAQ" },
  { id: "blog", label: "Blog" },
] as const;

export default async function PagesContentAdminPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const section = SECTIONS.some((s) => s.id === sp.section) ? (sp.section as string) : "about";

  let error = "";
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  let amenities: Awaited<ReturnType<typeof listAmenities>> = [];
  let posts: Awaited<ReturnType<typeof listCmsBlogPosts>> = [];
  let faqs: Awaited<ReturnType<typeof listFaqs>> = [];

  try {
    if (section === "about") {
      [texts, media] = await Promise.all([listTexts(), listMedia("about")]);
    } else if (section === "amenities") {
      [texts, amenities] = await Promise.all([listTexts(), listAmenities()]);
    } else if (section === "tour") {
      await ensureTexts([...TOUR_TEXT_DEFAULTS]);
      texts = await listTexts();
    } else if (section === "cta") {
      await ensureTexts([...HOME_CTA_TEXT_DEFAULTS]);
      await ensureMediaSlot({
        slot_key: "home_cta_image",
        label: "Home CTA — Side image",
        section: "home_cta",
        file_url: "/images/gallery/interior-lounge-2.png",
        alt_text: "Luxury caravan interior with seating and lighting",
      });
      [texts, media] = await Promise.all([listTexts(), listMedia("home_cta")]);
    } else if (section === "faq") {
      await ensureTexts([
        {
          text_key: "faq_title",
          label: "FAQ — Section title",
          content: "Frequently asked questions",
        },
        {
          text_key: "faq_subtitle",
          label: "FAQ — Section subtitle",
          content: "Straight answers before you book your trip.",
        },
        {
          text_key: "footer_blurb",
          label: "Footer — Brand description",
          content:
            "Premium Force Traveller caravans for family trips, weekend getaways, and curated road journeys across India.",
        },
      ]);
      [texts, faqs] = await Promise.all([listTexts(), listFaqs()]);
    } else if (section === "blog") {
      posts = await listCmsBlogPosts();
    }
  } catch {
    error =
      section === "faq"
        ? "FAQ table missing. Run: node scripts/migrate-faqs.mjs"
        : "CMS tables missing. Run home/content migrations.";
  }

  const aboutTexts = texts.filter((t) => t.text_key.startsWith("about_"));
  const amenityTexts = texts.filter((t) => t.text_key.startsWith("home_amenities_"));
  const tourTexts = texts.filter((t) => t.text_key.startsWith("home_tour_"));
  const ctaTexts = texts.filter((t) => t.text_key.startsWith("home_cta_"));
  const faqTexts = texts.filter(
    (t) => t.text_key.startsWith("faq_") || t.text_key === "footer_blurb"
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Website pages and text content — About, Amenities, Tour video, Plan trip CTA, FAQ and Blog.
      </p>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-charcoal-light/80 p-3">
        {SECTIONS.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/pages?section=${tab.id}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              section === tab.id
                ? "bg-gold text-charcoal"
                : "border border-white/15 text-zinc-300 hover:border-gold/50 hover:text-gold"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {!error && section === "about" ? (
        <div className="space-y-8">
          <TextsEditor initial={aboutTexts} />
          <MediaUploader items={media} />
        </div>
      ) : null}

      {!error && section === "amenities" ? (
        <div className="space-y-8">
          <TextsEditor initial={amenityTexts} />
          <AmenitiesEditor initial={amenities} />
        </div>
      ) : null}

      {!error && section === "tour" ? (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Paste a YouTube link in <span className="font-mono text-zinc-300">home_tour_url</span> —
            the home page tour section updates automatically.
          </p>
          <TextsEditor initial={tourTexts} />
        </div>
      ) : null}

      {!error && section === "cta" ? (
        <div className="space-y-8">
          <p className="text-sm text-zinc-400">
            Edit the home “Ready to plan your trip?” block — title, contact details, buttons and
            side image.
          </p>
          <TextsEditor initial={ctaTexts} />
          <MediaUploader items={media} />
        </div>
      ) : null}

      {!error && section === "faq" ? (
        <div className="space-y-8">
          <TextsEditor initial={faqTexts} />
          <FaqEditor initial={faqs} />
        </div>
      ) : null}

      {!error && section === "blog" ? <BlogEditor initial={posts} /> : null}
    </div>
  );
}
