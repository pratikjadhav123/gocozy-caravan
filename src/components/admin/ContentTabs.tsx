import Link from "next/link";

const TABS = [
  { id: "home", label: "Home", href: "/admin/content?tab=home&section=hero" },
  { id: "fleet", label: "Our Fleet", href: "/admin/content?tab=fleet" },
  { id: "packages", label: "Packages", href: "/admin/content?tab=packages" },
  { id: "blog", label: "Blog", href: "/admin/content?tab=blog" },
] as const;

export function ContentTabs({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-charcoal-light/80 p-3">
      {TABS.map((tab) => {
        const selected = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
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
