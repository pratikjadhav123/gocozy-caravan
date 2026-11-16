import Link from "next/link";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "fleet", label: "Our Fleet" },
  { id: "gallery", label: "Fleet Moments" },
  { id: "destinations", label: "Destinations" },
  { id: "amenities", label: "Amenities" },
  { id: "about", label: "About Us" },
] as const;

export function HomeSubTabs({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-charcoal/60 p-2.5">
      {TABS.map((tab) => {
        const selected = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={`/admin/content?tab=home&section=${tab.id}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              selected
                ? "bg-gold text-charcoal"
                : "border border-white/15 text-zinc-300 hover:border-gold/50 hover:text-gold"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
