import { PackagesEditor } from "@/components/admin/PackagesEditor";
import { TextsEditor } from "@/components/admin/TextsEditor";
import { listPackages, listTexts } from "@/lib/cms";

export default async function AdminPackagesCmsPage() {
  let packages: Awaited<ReturnType<typeof listPackages>> = [];
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let error = "";

  try {
    [packages, texts] = await Promise.all([listPackages(), listTexts()]);
  } catch {
    error = "CMS tables missing. Run: node scripts/migrate-cms.mjs";
  }

  const packageTexts = texts.filter((t) => t.text_key.startsWith("packages_") || t.text_key.startsWith("home_fleet_"));

  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">
        Edit package prices/text and home/packages section titles. Changes show on the website
        immediately.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (
        <>
          <section className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-white">Section text</h3>
            <TextsEditor initial={packageTexts} />
          </section>
          <section className="space-y-3">
            <h3 className="font-display text-lg font-semibold text-white">Packages</h3>
            <PackagesEditor initial={packages} />
          </section>
        </>
      )}
    </div>
  );
}
