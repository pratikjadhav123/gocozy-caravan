import { TextsEditor } from "@/components/admin/TextsEditor";
import { listTexts } from "@/lib/cms";

export default async function SettingsAdminPage() {
  let texts: Awaited<ReturnType<typeof listTexts>> = [];
  let error = "";
  try {
    texts = await listTexts();
  } catch {
    error = "Run: node scripts/migrate-media-library.mjs";
  }

  const settingsTexts = texts.filter((t) => t.text_key.startsWith("settings_"));

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Website settings — site name, contact, social links and SEO text.
      </p>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : settingsTexts.length ? (
        <TextsEditor initial={settingsTexts} />
      ) : (
        <p className="text-sm text-zinc-500">
          No settings rows yet. Run <code className="text-gold">node scripts/migrate-media-library.mjs</code>
        </p>
      )}
    </div>
  );
}
