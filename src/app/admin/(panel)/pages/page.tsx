import { AmenitiesEditor } from "@/components/admin/AmenitiesEditor";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { PackagesEditor } from "@/components/admin/PackagesEditor";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { listMedia, listPackages, listTexts } from "@/lib/cms";
import { listCmsBlogPosts } from "@/lib/cms-content";
import { listAmenities } from "@/lib/cms-home";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ section?: string }>;
};

const SECTIONS = [
  { id: "about", label: "About Us" },
  { id: "amenities", label: "Amenities" },
  { id: "packages", label: "Packages" },
  { id: "blog", label: "Blog" },
] as const;

export default async function PagesContentAdminPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const section = SECTIONS.some((s) => s.id === sp.section) ? (sp.section as string) : "about";

  let error = "";
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  let amenities: Awaited<ReturnType<typeof listAmenities>> = [];
  let packages: Awaited<ReturnType<typeof listPackages>> = [];
  let posts: Awaited<ReturnType<typeof listCmsBlogPosts>> = [];

  try {
    if (section === "about") {
      [texts, media] = await Promise.all([listTexts(), listMedia("about")]);
    } else if (section === "amenities") {
      [texts, amenities] = await Promise.all([listTexts(), listAmenities()]);
    } else if (section === "packages") {
      [texts, packages] = await Promise.all([listTexts(), listPackages()]);
    } else if (section === "blog") {
      posts = await listCmsBlogPosts();
    }
  } catch {
    error = "CMS tables missing. Run home/content migrations.";
  }

  const aboutTexts = texts.filter((t) => t.text_key.startsWith("about_"));
  const amenityTexts = texts.filter((t) => t.text_key.startsWith("home_amenities_"));
  const packageTexts = texts.filter((t) => t.text_key.startsWith("packages_"));

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Website pages and text content — About, Amenities, Packages and Blog.
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

      {!error && section === "packages" ? (
        <div className="space-y-8">
          <TextsEditor initial={packageTexts} />
          <PackagesEditor initial={packages} />
        </div>
      ) : null}

      {!error && section === "blog" ? <BlogEditor initial={posts} /> : null}
    </div>
  );
}
