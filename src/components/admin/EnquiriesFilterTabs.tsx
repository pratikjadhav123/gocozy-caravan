import Link from "next/link";

const TABS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
] as const;

export function EnquiriesFilterTabs({
  active,
  counts,
}: {
  active: string;
  counts: { all: number; new: number; replied: number; closed: number };
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-charcoal-light/80 p-3">
      {TABS.map((tab) => {
        const selected = active === tab.value;
        const count = counts[tab.value];
        return (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/contacts" : `/admin/contacts?status=${tab.value}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              selected
                ? "bg-gold text-charcoal"
                : "border border-white/15 text-zinc-300 hover:border-gold/50 hover:text-gold"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 ${selected ? "text-charcoal/70" : "text-zinc-500"}`}>
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
